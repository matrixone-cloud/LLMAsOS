import asyncio
import http.server
import socketserver
import threading
from web_agent.core.system_orchestrator import SystemOrchestrator

class CORSRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()
def start_server():
    PORT = 8000
    handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(("", PORT), CORSRequestHandler) as httpd:
        print(f"Serving at port {PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass
        finally:
            httpd.server_close()
            print("Server closed")

if __name__ == "__main__":
    server_thread = threading.Thread(target=start_server)
    server_thread.daemon = True  # 设置为守护线程，主线程结束时会自动退出
    server_thread.start()

    orchestrator = SystemOrchestrator(agent_scenario="user,planner_agent,browser_nav_agent,browser_nav_executor",input_mode="GUI_ONLY")
    asyncio.run(orchestrator.start())



# 🧠 Task Manager MCP Server

A complete **TypeScript** implementation of a **Model Context Protocol (MCP)** server for task management. This server enables **AI agents like Claude Desktop** to create, manage, and track tasks through natural language conversations.

---

## 🚀 Features

- **Task Management** – Create, update, delete, and list tasks  
- **Smart Filtering** – Filter tasks by status (todo, in-progress, completed) and priority (low, medium, high)  
- **Statistics & Analytics** – Get comprehensive task insights  
- **Resource Access** – JSON-based task summaries for AI agents  
- **Type Safety** – Full TypeScript implementation with proper validation  
- **Error Handling** – Robust error handling with user-friendly messages

---

## 📋 Available Tools

| Tool | Description |
|------|-------------|
| `create_task` | Create tasks with title, description, priority, due date, and tags |
| `list_tasks` | List and filter tasks |
| `update_task_status` | Change task status (todo → in-progress → completed) |
| `get_task_stats` | Get detailed task analytics |

---

## 🛠️ Prerequisites

- **Node.js** (v18+)
- **npm**
- **TypeScript** (auto-installed)
- **Git**
- **VS Code** or **Cursor** recommended

### Platform-Specific Setup

<details>
<summary>Windows</summary>

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

</details>

<details>
<summary>macOS</summary>

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

</details>

<details>
<summary>Linux (Debian/Ubuntu)</summary>

```bash
sudo apt-get install build-essential
```

</details>

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/abhilashsahoo/mcp-typescript.git
cd mcp-task-manager
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build the Project

```bash
npm run build
```

### 4. Test the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

---

## 🧪 MCP Inspector (Optional)

```bash
npm install -g @modelcontextprotocol/inspector

npx @modelcontextprotocol/inspector node dist/index.js
```

---

## 🔌 Connect to Claude Desktop

### 1. Locate Config File

| OS | Path |
|----|------|
| Windows | `%APPDATA%\Claude\claude_desktop_config.json` |
| macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Linux | `~/.config/Claude/claude_desktop_config.json` |

### 2. Add Server Configuration

```json
{
  "mcpServers": {
    "task-manager": {
      "command": "node",
      "args": ["/absolute/path/to/your/project/dist/index.js"],
      "env": {}
    }
  }
}
```

> Replace the path with your real project directory.

### 3. Restart Claude Desktop

Close and reopen Claude completely.

---

## 🎯 Claude Desktop Interface

Once connected, you'll see:

- ✅ `task-manager` listed in Tools Panel  
- ✅ T icon beside the name  
- ✅ Badge showing 4 available tools  
- ✅ No error indicators

---

## 💬 Usage Examples

Try the following inside Claude Desktop:

- **Create**: _Create a task "Deploy website" with high priority due on 2025-02-01_  
- **List**: _Show me all my tasks_  
- **Filter**: _Show me only high priority tasks_  
- **Update**: _Update task-1 to completed status_  
- **Stats**: _Give me task statistics_

---

## 📁 Project Structure

```
mcp-task-manager/
├── src/
│   ├── types/              # TypeScript types
│   ├── tools/              # MCP tool implementations
│   ├── task-manager.ts     # Core task logic
│   └── index.ts            # Main server entry
├── dist/                   # Compiled JS
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🧪 Available Scripts

| Script | Command |
|--------|---------|
| Dev Server | `npm run dev` |
| Build | `npm run build` |
| Start Built Server | `npm start` |
| Type Check | `npm run type-check` |
| Clean Build | `npm run clean` |

---

## 🛠️ Development

### Adding New Tools

1. Define schema in `src/tools/task-tools.ts`  
2. Implement handler  
3. Register tool in server

### Add Persistence

1. Install DB (e.g., `sqlite3`, `pg`)  
2. Add DB connection module  
3. Refactor TaskManager to use DB  
4. Add `.env` config

---

## 🐛 Troubleshooting

| Issue | Fix |
|-------|-----|
| Module not found | `rm -rf node_modules package-lock.json && npm install` |
| TS errors | `npx tsc --showConfig` |
| Claude can’t detect tool | Check absolute path, config JSON, `dist/index.js`, restart Claude |

### Debug Mode

```bash
DEBUG=true node dist/index.js
```

---

## 🔗 Learn More

📖 **Complete Tutorial**: _Build Your First MCP Server with TypeScript_

Covers:

- Full setup and IDE config  
- Understanding MCP architecture  
- Implementation walkthrough  
- Testing & debugging  
- Deployment tips

---

## 📄 License

MIT License. See `LICENSE` file.

---

## 🤝 Contributing

Pull Requests welcome!  
Open issues for bugs, or propose new features.

---

## 🌟 Feature Roadmap

- [ ] Database persistence  
- [ ] Task categories & projects  
- [ ] Due date notifications  
- [ ] Task templates  
- [ ] Bulk operations  
- [ ] Import/export tasks  
- [ ] Calendar integrations

---

## 💡 Need Help?

- [Read the tutorial](https://www.infyways.com/build-your-first-mcp-server-with-typescript/)
- [Open an issue](https://github.com/abhilashsahoo/mcp-typescript/issues)
- [Email: abhilash@infyways.com](mailto:abhilash@infyways.com)

---

> Built with ❤️ using TypeScript and the Model Context Protocol  
> This project shows how MCP empowers AI agents with real-world tools. Ideal for learning or building automation systems.

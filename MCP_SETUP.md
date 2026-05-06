# MCP Client Setup for Supabase

This guide explains how to configure the MCP (Model Context Protocol) client for Supabase integration.

## What is MCP?

MCP (Model Context Protocol) allows AI agents to interact with external tools and services. The Supabase MCP server provides AI agents with direct access to your Supabase project for database operations, debugging, and more.

## Prerequisites

- **Windsurf version 0.1.37 or higher**
- Node.js installed

## Configuration

### Option 1: Automatic Setup (Recommended)

The MCP configuration file has been created in the project at:
```
.windsurf/mcp_config.json
```

**Note**: You need to copy this file to your Windsurf configuration directory:

**Windows:**
```powershell
Copy-Item .windsurf\mcp_config.json $env:USERPROFILE\.codeium\windsurf\mcp_config.json
```

**Mac/Linux:**
```bash
cp .windsurf/mcp_config.json ~/.codeium/windsurf/mcp_config.json
```

### Option 2: Manual Setup

1. Create or edit the MCP configuration file:
   - **Windows**: `C:\Users\YOUR_USERNAME\.codeium\windsurf\mcp_config.json`
   - **Mac/Linux**: `~/.codeium/windsurf/mcp_config.json`

2. Add the following configuration:
```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://mcp.supabase.com/mcp?project_ref=hmphprybilzjdyaypgcy&features=docs%2Cdatabase%2Cdebugging%2Caccount%2Cdevelopment%2Cfunctions%2Cbranching%2Cstorage"
      ]
    }
  }
}
```

3. Restart Windsurf to apply the changes

## Configuration Details

The MCP server URL includes the following features:
- `docs` - Documentation access
- `database` - Database operations
- `debugging` - Debugging tools
- `account` - Account management
- `development` - Development tools
- `functions` - Edge functions
- `branching` - Database branching
- `storage` - Storage management

## Project Reference

Your Supabase project reference: `hmphprybilzjdyaypgcy`

## Verification

After configuration, you can verify MCP is working by:

1. Open Windsurf
2. Start a new chat
3. Ask about your Supabase project, e.g., "Show me the tables in my database"
4. The AI should be able to query your Supabase project directly

## Agent Skills (Already Installed)

Agent Skills have been installed to provide AI agents with ready-made instructions for working with Supabase:

✅ **Postgres Best Practices** - Optimized queries and database design
✅ **Find Skills** - Discover and suggest additional skills

These skills are located in:
- `.agents\skills\supabase-postgres-best-practices`
- `.agents\skills\find-skills`

## Troubleshooting

### MCP Server Not Connecting

1. Verify Windsurf version is 0.1.37 or higher
2. Check the configuration file path is correct
3. Ensure Node.js is installed and accessible
4. Restart Windsurf completely
5. Check for firewall or network restrictions

### mcp-remote Not Found

The `mcp-remote` package is automatically installed via `npx -y`. If it fails:

```bash
# Install manually
npm install -g mcp-remote
```

### Permission Denied (Windows)

If you can't write to `C:\Users\YOUR_USERNAME\.codeium\windsurf\`:

1. Run Windsurf as Administrator
2. Or manually create the file in a text editor with admin privileges

## Benefits of MCP Integration

With MCP configured, AI agents can:

- **Query your database directly** - Run SQL queries without leaving the chat
- **Create and run migrations** - Apply schema changes automatically
- **Debug database issues** - Analyze performance and errors
- **Generate TypeScript types** - Auto-generate types from your schema
- **Manage branches** - Create and switch database branches for development
- **Access documentation** - Get help with Supabase features directly

## Example Usage

Once configured, you can ask:

```
"Show me all products in the database"
```

```
"Create a new table for customer reviews"
```

```
"Optimize this query for better performance"
```

```
"Generate TypeScript types from my schema"
```

## Additional Resources

- [MCP Documentation](https://modelcontextprotocol.io/)
- [Supabase MCP Server](https://mcp.supabase.com/)
- [Windsurf Documentation](https://docs.windsurf.ai/)
- [Agent Skills Documentation](https://skills.sh/)

## Next Steps

1. ✅ MCP configuration file created in `.windsurf/mcp_config.json`
2. ✅ Agent Skills installed (Postgres Best Practices, Find Skills)
3. ⏳ Copy configuration to Windsurf directory (manual step required)
4. ⏳ Restart Windsurf
5. ⏳ Test MCP connection

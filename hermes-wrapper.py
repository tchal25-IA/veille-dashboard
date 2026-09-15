#!/usr/bin/env python3
"""
Hermes wrapper for veille cron job
Provides web_search, web_extract, and Claude API access
"""

import json
import sys
import os

def web_search(query, limit=3):
    """Search using Hermes web_search tool"""
    try:
        from hermes_tools import web_search as hermes_search
        result = hermes_search(query, limit=limit)
        if "data" in result and "web" in result["data"]:
            return result["data"]["web"]
        return []
    except ImportError:
        # Fallback when hermes_tools not available
        return []

def web_extract(urls):
    """Extract content from URLs using Hermes web_extract tool"""
    try:
        from hermes_tools import web_extract as hermes_extract
        result = hermes_extract(urls)
        if "results" in result:
            return result["results"]
        return []
    except ImportError:
        return []

def claude_api(prompt):
    """Call Claude API for translation and analysis"""
    try:
        import anthropic
        client = anthropic.Anthropic(api_key=os.environ.get('ANTHROPIC_API_KEY'))
        message = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1500,
            messages=[{"role": "user", "content": prompt}]
        )
        return message.content[0].text
    except Exception:
        return None

if __name__ == "__main__":
    command = sys.argv[1] if len(sys.argv) > 1 else None
    
    if command == "search":
        query = sys.argv[2] if len(sys.argv) > 2 else ""
        limit = int(sys.argv[3]) if len(sys.argv) > 3 else 3
        results = web_search(query, limit)
        print(json.dumps(results))
    
    elif command == "extract":
        urls = json.loads(sys.argv[2]) if len(sys.argv) > 2 else []
        results = web_extract(urls)
        print(json.dumps(results))
    
    elif command == "translate":
        text = sys.argv[2] if len(sys.argv) > 2 else ""
        prompt = f'Traduis en français (une ligne max 120 chars): "{text}"'
        result = claude_api(prompt)
        print(result or text)
    
    elif command == "analyze":
        category = sys.argv[2] if len(sys.argv) > 2 else ""
        text = sys.argv[3] if len(sys.argv) > 3 else ""
        prompt = f'Écris une analyse en français de 2-3 paragraphes (200-300 mots) sur "{category}" basée sur: {text[:500]}'
        result = claude_api(prompt)
        print(result or f"Analyse pour {category}")

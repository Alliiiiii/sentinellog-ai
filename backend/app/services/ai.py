import os
from openai import OpenAI

def summarize_logs(logs: list[dict]) -> str:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        # Offline fallback summary
        high = [l for l in logs if l.get("severity") in ("high", "critical")]
        ips = sorted({l.get("ip") for l in high})[:5]
        return (
            f"Detected {len(high)} high/critical events out of {len(logs)} total. "
            f"Top offending IPs: {', '.join(ips) if ips else 'none'}. "
            "Recommend blocking repeated offenders and reviewing SSH/HTTP access logs."
        )
    client = OpenAI(api_key=api_key)
    prompt = "Summarize these security logs in one paragraph, highlighting threats and recommended actions:\n" + \
             "\n".join(f"{l['timestamp']} {l['ip']} {l['event']} ({l['severity']})" for l in logs[:30])
    resp = client.chat.completions.create(
        model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
        messages=[{"role": "user", "content": prompt}],
        max_tokens=200,
    )
    return resp.choices[0].message.content.strip()

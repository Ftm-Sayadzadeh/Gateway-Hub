"""
Data parsers for gateway system metrics
"""
import re
import logging

logger = logging.getLogger(__name__)

def parse_cpu_usage(cpu_string):
    """
    Parse CPU usage string to extract percentage
    Example: "CPU Usage: 3%" -> 3.0
    """
    if not cpu_string:
        return None
    
    try:
        match = re.search(r'(\d+(?:\.\d+)?)%?', cpu_string)
        if match:
            return float(match.group(1))
    except (ValueError, AttributeError) as e:
        logger.warning(f"Could not parse CPU usage '{cpu_string}': {e}")
    
    return None

def parse_memory_usage(memory_string):
    """
    Parse memory usage string to extract percentage
    Example: "Memory Usage:44%" -> 44.0
    """
    if not memory_string:
        return None
    
    try:
        match = re.search(r'(\d+(?:\.\d+)?)%?', memory_string)
        if match:
            return float(match.group(1))
    except (ValueError, AttributeError) as e:
        logger.warning(f"Could not parse memory usage '{memory_string}': {e}")
    
    return None

def parse_uptime(uptime_string):
    """
    Parse uptime string to extract formatted version
    Example: "System uptime: 7 days, 7 hour(s), 16 minutes, 51 seconds" -> "7d 7h 16m"
    """
    if not uptime_string:
        return "Unknown"
    
    try:
        result = {"days": 0, "hours": 0, "minutes": 0, "seconds": 0}
        
        days_match = re.search(r'(\d+)\s*day', uptime_string)
        if days_match:
            result["days"] = int(days_match.group(1))
        
        hours_match = re.search(r'(\d+)\s*hour', uptime_string)
        if hours_match:
            result["hours"] = int(hours_match.group(1))
        
        minutes_match = re.search(r'(\d+)\s*minute', uptime_string)
        if minutes_match:
            result["minutes"] = int(minutes_match.group(1))
        
        seconds_match = re.search(r'(\d+)\s*second', uptime_string)
        if seconds_match:
            result["seconds"] = int(seconds_match.group(1))
        
        if result["days"] > 0:
            return f"{result['days']}d {result['hours']}h {result['minutes']}m"
        elif result["hours"] > 0:
            return f"{result['hours']}h {result['minutes']}m"
        elif result["minutes"] > 0:
            return f"{result['minutes']}m {result['seconds']}s"
        else:
            return f"{result['seconds']}s"
            
    except Exception as e:
        logger.warning(f"Could not parse uptime '{uptime_string}': {e}")
        return "Unknown"

def get_clean_system_info(raw_info):
    try:
        cpu_raw = raw_info.get('cpu_usage', '')
        memory_raw = raw_info.get('memory_usage', '')
        uptime_raw = raw_info.get('uptime', '')
        
        # Parse individual components
        cpu_percent = parse_cpu_usage(cpu_raw)
        memory_percent = parse_memory_usage(memory_raw)
        uptime_formatted = parse_uptime(uptime_raw)
        
        return {
            # Raw strings (for debugging)
            'cpu_usage_raw': cpu_raw,
            'memory_usage_raw': memory_raw,
            'uptime_raw': uptime_raw,
            
            # Parsed values
            'cpu_usage_percent': cpu_percent,
            'memory_usage_percent': memory_percent,
            'uptime_formatted': uptime_formatted,
            
            # Formatted for display
            'cpu_usage_display': f"{cpu_percent}%" if cpu_percent is not None else "N/A",
            'memory_usage_display': f"{memory_percent}%" if memory_percent is not None else "N/A",
            'uptime_display': uptime_formatted,
            
            # Other fields
            'gateway_address': raw_info.get('gateway_address'),
            'gateway_port': raw_info.get('gateway_port'),
            'connection_string': raw_info.get('connection_string'),
            'status': raw_info.get('status'),
            'timestamp': raw_info.get('timestamp'),
            'error': raw_info.get('error')
        }
        
    except Exception as e:
        logger.error(f"Error processing system info: {e}")
        return raw_info 
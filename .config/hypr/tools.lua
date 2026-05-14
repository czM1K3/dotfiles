local tools = {}

function tools.get_hostname()
    -- io.popen runs a shell command and returns a file handle
    local f = io.popen("/bin/hostname")
    if f then
        local hostname = f:read("*a") or ""
        f:close()
        -- Remove trailing whitespace/newlines
        return hostname:gsub("%s+", "")
    end
    return nil
end

return tools

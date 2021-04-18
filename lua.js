const fs = require('fs');

var LuaVM = require('./lua.vm.js')
exports.Lua = function (script) {
    return LuaVM.L.execute(script)
}

global.lua_rep = {}

global.readfile = function (filename) {
    value = fs.readFileSync(filename).toString();
    return value
}
global.require = require
global.jstype = function(obj){return typeof(obj);}
global.isnull = function(obj){return obj == null;}
exports.Lua(`

local DEBUG_PRINT = false

function debug_print(...)
  if (DEBUG_PRINT) then
    print(...)
  end
end

debug_print('Lua')

_G_MT = {
  __rep = {},
  __result = {}
}

_G_MT.__index = function(table, key)  
	if _G_MT.__rep[key] then	
		return _G_MT.__rep[key]
	else
		local obj = js.global[key]
		_G_MT.__rep[key] = obj		
		debug_print("__index", table, key, obj)
		return obj
	end
end

_G_MT.__newindex = function (t,k, obj)
  debug_print("__newindex", t,k,obj)
	_G_MT.__rep[k] = obj
end

setmetatable(_G, _G_MT)

function javascript(script)
  return js.global:eval(script)
end

function dofile(filename)
  local script = javascript('readfile("'..filename..'")')
  local chunk = assert(loadstring(script))
  return chunk()
end

function printtable(t, level)
  local result = ""  
  if (level == nil) then
    level = 0
  end
  local indent = ""
  for i = 1, level do
    indent = indent + " "
  end
  if (type(t) == "table") then
    for k, v in pairs(t) do
      if (type(v) == "table") then
        result = result .. printtable(v, level + 1)
      else
        result = result .. indent .. k.. ":"..tostring(v).."\\n"
      end
    end
  end
  return result
end

function import(module)  
  debug_print("Importing "..module)
  local obj = js.global:require(module)      
  js.global.lua_rep[module] = obj
  debug_print("Obj:\\n"..tostring(obj).."\\n"..printtable(getmetatable(obj)))
  if (obj.prototype.length ~= nil) then
    return obj
  end
  return MKC(obj)
end

function MKC(obj)
    return function(...) return obj(obj, ...) end
end
`)

global.Lua = exports.Lua






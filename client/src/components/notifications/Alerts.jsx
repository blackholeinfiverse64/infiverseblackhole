import { useState } from "react";import { useState } from "react";import { useState } from "react";import { useState } from "react";

import { Bell } from "lucide-react";

import { Button } from "../ui/button";import { Bell } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import { Badge } from "../ui/badge";import { Button } from "../ui/button";import { Bell, Trash2, AlertTriangle } from "lucide-react";

import { useSocket } from "../../context/socket-context";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export function Alerts() {

  const { monitoringAlerts } = useSocket();import { Badge } from "../ui/badge";import { Button } from "../ui/button";import { Bell, Trash2, AlertTriangle } from "lucide-react";import { useState } from "react";

  const [readAlerts, setReadAlerts] = useState(new Set());

import { useSocket } from "../../context/socket-context";

  const unreadCount = monitoringAlerts.filter((alert) => !readAlerts.has(alert.data._id)).length;

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

  const markAsRead = (alertId) => {

    setReadAlerts((prev) => new Set([...prev, alertId]));export function Alerts() {

  };

  const { monitoringAlerts } = useSocket();import { Badge } from "../ui/badge";import { Button } from "../ui/button";import { Bell, X, Trash2, AlertTriangle } from "lucide-react";

  return (

    <Popover>  const [readAlerts, setReadAlerts] = useState(new Set());

      <PopoverTrigger asChild>

        <Button variant="ghost" size="icon" className="relative">import { useSocket } from "../../context/socket-context";

          <Bell className="h-5 w-5 text-red-500" />

          {unreadCount > 0 && (  const unreadCount = monitoringAlerts.filter((alert) => !readAlerts.has(alert.data._id)).length;

            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs">

              {unreadCount}import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";import { Button } from "../ui/button";

            </Badge>

          )}  const markAsRead = (alertId) => {

        </Button>

      </PopoverTrigger>    setReadAlerts((prev) => new Set([...prev, alertId]));export function Alerts() {

      <PopoverContent 

        className="w-96 rounded-2xl p-0"  };

        align="end"

        style={{  const { monitoringAlerts } = useSocket();import { Badge } from "../ui/badge";import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

          backgroundColor: '#0a0a0f',

          border: '2px solid rgba(168, 85, 247, 0.4)',  return (

          color: 'white',

          boxShadow: '0 0 30px rgba(168, 85, 247, 0.3)'    <Popover>  const [readAlerts, setReadAlerts] = useState(new Set());

        }}

      >      <PopoverTrigger asChild>

        <div style={{

          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(245, 158, 11, 0.2))',        <Button variant="ghost" size="icon" className="relative" aria-label={`Alerts (${unreadCount} unread)`}>import { useSocket } from "../../context/socket-context";import { Badge } from "../ui/badge";

          padding: '20px'

        }}>          <Bell className="h-5 w-5 text-red-500" />

          <h4 style={{color: 'white', margin: 0}}>🌌 Cosmic Alerts</h4>

        </div>          {unreadCount > 0 && (  const unreadCount = monitoringAlerts.filter((alert) => !readAlerts.has(alert.data._id)).length;

        

        <div style={{padding: '20px'}}>            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs">

          {monitoringAlerts.length === 0 ? (

            <p style={{color: 'white', textAlign: 'center'}}>No alerts ✨</p>              {unreadCount}import { useSocket } from "../../context/socket-context";

          ) : (

            monitoringAlerts.map((alert) => (            </Badge>

              <div

                key={alert.data._id}          )}  const markAsRead = (alertId) => {

                onClick={() => markAsRead(alert.data._id)}

                style={{        </Button>

                  padding: '10px',

                  marginBottom: '10px',      </PopoverTrigger>    setReadAlerts((prev) => new Set([...prev, alertId]));export function Alerts() {

                  borderRadius: '8px',

                  cursor: 'pointer',      <PopoverContent 

                  background: 'rgba(239, 68, 68, 0.1)',

                  border: '1px solid rgba(239, 68, 68, 0.3)',        className="w-96 rounded-2xl p-0 overflow-hidden"   };

                  color: 'white'

                }}        align="end"

              >

                <h5 style={{margin: 0, fontSize: '14px'}}>{alert.data.title}</h5>        style={{  const { monitoringAlerts } = useSocket();export function Alerts() {

                <p style={{margin: '5px 0 0 0', fontSize: '12px', opacity: 0.8}}>

                  {alert.data.description}          backgroundColor: '#0a0a0f',

                </p>

              </div>          border: '2px solid rgba(168, 85, 247, 0.4)',  return (

            ))

          )}          color: 'white',

        </div>

      </PopoverContent>          boxShadow: '0 0 30px rgba(168, 85, 247, 0.3)'    <Popover>  const [readAlerts, setReadAlerts] = useState(new Set());  const { monitoringAlerts } = useSocket();

    </Popover>

  );        }}

}
      >      <PopoverTrigger asChild>

        <div 

          style={{        <Button variant="ghost" size="icon" className="relative" aria-label={`Alerts (${unreadCount} unread)`}>  const [deletedAlerts, setDeletedAlerts] = useState(new Set());  const [readAlerts, setReadAlerts] = useState(new Set());

            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(245, 158, 11, 0.2))',

            padding: '20px',          <Bell className="h-5 w-5 text-red-500" />

            borderBottom: '1px solid rgba(168, 85, 247, 0.3)'

          }}          {unreadCount > 0 && (  const [deletedAlerts, setDeletedAlerts] = useState(new Set());

        >

          <h4 style={{color: 'white', margin: 0, fontSize: '18px', fontWeight: 'bold'}}>            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs">

            🌌 Cosmic Alerts

          </h4>              {unreadCount}  const filteredAlerts = monitoringAlerts.filter(alert => !deletedAlerts.has(alert.data._id));

          <p style={{color: 'rgba(245, 158, 11, 0.8)', margin: '5px 0 0 0', fontSize: '12px'}}>

            Monitoring your workspace            </Badge>

          </p>

        </div>          )}  const unreadCount = filteredAlerts.filter((alert) => !readAlerts.has(alert.data._id)).length;  const filteredAlerts = monitoringAlerts.filter(alert => !deletedAlerts.has(alert.data._id));

        

        <div style={{padding: '20px', backgroundColor: 'rgba(10, 10, 15, 0.9)'}}>        </Button>

          {monitoringAlerts.length === 0 ? (

            <div style={{textAlign: 'center', padding: '20px'}}>      </PopoverTrigger>  const unreadCount = filteredAlerts.filter((alert) => !readAlerts.has(alert.data._id)).length;

              <Bell style={{color: 'rgba(245, 158, 11, 0.4)', width: '48px', height: '48px', margin: '0 auto 10px'}} />

              <p style={{color: 'white', margin: 0}}>No alerts</p>      <PopoverContent 

              <p style={{color: 'rgba(255, 255, 255, 0.6)', margin: '5px 0 0 0', fontSize: '12px'}}>

                Your cosmic workspace is running smoothly ✨        className="w-96 backdrop-blur-xl shadow-2xl rounded-2xl p-0 overflow-hidden"   const markAsRead = (alertId) => {

              </p>

            </div>        align="end"

          ) : (

            <div style={{maxHeight: '300px', overflowY: 'auto'}}>        style={{    setReadAlerts((prev) => new Set([...prev, alertId]));  const markAsRead = (alertId) => {

              {monitoringAlerts.map((alert) => (

                <div          backgroundColor: '#0a0a0f',

                  key={alert.data._id}

                  onClick={() => markAsRead(alert.data._id)}          border: '2px solid rgba(168, 85, 247, 0.4)',  };    setReadAlerts((prev) => new Set([...prev, alertId]));

                  style={{

                    padding: '15px',          color: 'white',

                    marginBottom: '10px',

                    borderRadius: '12px',          boxShadow: '0 0 30px rgba(168, 85, 247, 0.3), 0 0 60px rgba(168, 85, 247, 0.1)'  };

                    cursor: 'pointer',

                    background: readAlerts.has(alert.data._id)         }}

                      ? 'rgba(168, 85, 247, 0.1)' 

                      : 'rgba(239, 68, 68, 0.1)',      >  const deleteAlert = (alertId, e) => {

                    border: `1px solid ${readAlerts.has(alert.data._id) ? 'rgba(168, 85, 247, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,

                    opacity: readAlerts.has(alert.data._id) ? '0.7' : '1'        {/* Enhanced Header */}

                  }}

                >        <div     e.stopPropagation();  const deleteAlert = (alertId, e) => {

                  <h5 style={{color: 'white', margin: '0 0 5px 0', fontSize: '14px', fontWeight: 'bold'}}>

                    {alert.data.title}          className="px-6 py-5 border-b"

                  </h5>

                  <p style={{color: 'rgba(255, 255, 255, 0.8)', margin: '0 0 8px 0', fontSize: '12px'}}>          style={{    setDeletedAlerts((prev) => new Set([...prev, alertId]));    e.stopPropagation();

                    {alert.data.description}

                  </p>            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(245, 158, 11, 0.2), rgba(168, 85, 247, 0.3))',

                  <p style={{color: 'rgba(245, 158, 11, 0.7)', margin: 0, fontSize: '10px'}}>

                    {new Date(alert.timestamp).toLocaleString()}            borderBottomColor: 'rgba(168, 85, 247, 0.3)'  };    setDeletedAlerts((prev) => new Set([...prev, alertId]));

                  </p>

                </div>          }}

              ))}

            </div>        >  };

          )}

        </div>          <div className="flex items-center justify-between">



        <div             <div className="flex items-center space-x-3">  const deleteAllRead = () => {

          style={{

            padding: '15px',              <div 

            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(245, 158, 11, 0.1))',

            borderTop: '1px solid rgba(168, 85, 247, 0.3)',                className="p-2 rounded-full"    const readAlertIds = filteredAlerts  const deleteAllRead = () => {

            textAlign: 'center'

          }}                style={{

        >

          <p style={{color: 'rgba(255, 255, 255, 0.6)', margin: 0, fontSize: '11px'}}>                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.3), rgba(168, 85, 247, 0.3))',      .filter(alert => readAlerts.has(alert.data._id))    const readAlertIds = filteredAlerts

            💫 Click alerts to mark as read

          </p>                  boxShadow: '0 0 15px rgba(245, 158, 11, 0.4)'

        </div>

      </PopoverContent>                }}      .map(alert => alert.data._id);      .filter(alert => readAlerts.has(alert.data._id))

    </Popover>

  );              >

}
                <Bell className="h-6 w-6 text-amber-400 animate-pulse" />    setDeletedAlerts((prev) => new Set([...prev, ...readAlertIds]));      .map(alert => alert.data._id);

              </div>

              <div>  };    setDeletedAlerts((prev) => new Set([...prev, ...readAlertIds]));

                <h4 className="text-xl font-bold" style={{color: 'white', textShadow: '0 0 10px rgba(255, 255, 255, 0.5)'}}>

                  Monitoring Alerts  };

                </h4>

                <p className="text-xs" style={{color: 'rgba(245, 158, 11, 0.8)'}}>  return (

                  Cosmic Workspace Notifications

                </p>    <Popover>  return (

              </div>

            </div>      <PopoverTrigger asChild>    <Popover>

            {unreadCount > 0 && (

              <Badge         <Button variant="ghost" size="icon" className="relative" aria-label={`Alerts (${unreadCount} unread)`}>      <PopoverTrigger asChild>

                className="text-white text-sm px-3 py-1 rounded-full animate-bounce font-bold"

                style={{          <Bell className="h-5 w-5 text-red-500" />        <Button variant="ghost" size="icon" className="relative" aria-label={`Alerts (${unreadCount} unread)`}>

                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',

                  boxShadow: '0 0 15px rgba(239, 68, 68, 0.6)'          {unreadCount > 0 && (          <Bell className="h-5 w-5 text-red-500" />

                }}

              >            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs">          {unreadCount > 0 && (

                {unreadCount} new

              </Badge>              {unreadCount}            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs">

            )}

          </div>            </Badge>              {unreadCount}

          {unreadCount > 0 && (

            <div className="mt-3">          )}            </Badge>

              <Button

                variant="ghost"        </Button>          )}

                size="sm"

                onClick={() => {      </PopoverTrigger>        </Button>

                  setReadAlerts(new Set(monitoringAlerts.map((a) => a.data._id)));

                }}      <PopoverContent       </PopoverTrigger>

                className="text-xs transition-all duration-300 rounded-lg px-3 py-1"

                style={{        className="cosmic-alert-window w-[420px] backdrop-blur-xl shadow-2xl rounded-2xl p-0 overflow-hidden"       <PopoverContent 

                  color: 'rgba(245, 158, 11, 0.9)',

                  backgroundColor: 'rgba(245, 158, 11, 0.1)',        align="end"        className="cosmic-alert-window w-[420px] backdrop-blur-xl shadow-2xl rounded-2xl p-0 overflow-hidden" 

                  border: '1px solid rgba(245, 158, 11, 0.3)'

                }}        style={{        align="end"

              >

                ✓ Mark all read          backgroundColor: '#0a0a0f !important',        style={{

              </Button>

            </div>          border: '2px solid rgba(168, 85, 247, 0.4) !important',          backgroundColor: '#0a0a0f !important',

          )}

        </div>          color: 'white !important',          border: '2px solid rgba(168, 85, 247, 0.4) !important',



        {/* Content Area */}          boxShadow: '0 0 30px rgba(168, 85, 247, 0.3), 0 0 60px rgba(168, 85, 247, 0.1) !important'          color: 'white !important',

        <div 

          className="p-5"         }}          boxShadow: '0 0 30px rgba(168, 85, 247, 0.3), 0 0 60px rgba(168, 85, 247, 0.1), inset 0 0 0 1px rgba(168, 85, 247, 0.2) !important'

          style={{

            backgroundColor: 'rgba(10, 10, 15, 0.9)',      >        }}

            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.05) 0%, transparent 50%)'

          }}        {/* Enhanced Header with Cosmic Styling */}      >

        >

          <div className="space-y-4 max-h-96 overflow-y-auto">        <div         {/* Test Header */}

            {monitoringAlerts.length === 0 ? (

              <div className="text-center py-12">          className="px-6 py-5 border-b relative overflow-hidden"        <div 

                <div 

                  className="mx-auto mb-4 p-4 rounded-full"          style={{          className="px-6 py-5 border-b relative overflow-hidden"

                  style={{

                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(168, 85, 247, 0.2))',            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(245, 158, 11, 0.2), rgba(168, 85, 247, 0.3)) !important',          style={{

                    width: 'fit-content'

                  }}            borderBottomColor: 'rgba(168, 85, 247, 0.3) !important'            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(245, 158, 11, 0.2), rgba(168, 85, 247, 0.3)) !important',

                >

                  <Bell className="h-16 w-16" style={{color: 'rgba(245, 158, 11, 0.4)'}} />          }}            borderBottomColor: 'rgba(168, 85, 247, 0.3) !important'

                </div>

                <h3 className="text-lg font-semibold mb-2" style={{color: 'rgba(255, 255, 255, 0.8)'}}>        >          }}

                  All Clear in the Cosmos

                </h3>          <div className="relative z-10">        >

                <p className="text-sm" style={{color: 'rgba(255, 255, 255, 0.6)'}}>No alerts at the moment</p>

                <p className="text-xs mt-1" style={{color: 'rgba(245, 158, 11, 0.6)'}}>            <div className="flex items-center justify-between mb-2">          <div className="relative z-10">

                  Your cosmic workspace is running smoothly ✨

                </p>              <div className="flex items-center space-x-3">            <div className="flex items-center justify-between mb-2">

              </div>

            ) : (                <div               <div className="flex items-center space-x-3">

              monitoringAlerts.map((alert) => (

                <div                  className="p-2 rounded-full"                <div 

                  key={alert.data._id}

                  className="group relative p-5 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02]"                  style={{                  className="p-2 rounded-full"

                  style={{

                    background: readAlerts.has(alert.data._id)                     background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.3), rgba(168, 85, 247, 0.3))',                  style={{

                      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(168, 85, 247, 0.08))' 

                      : 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(249, 115, 22, 0.1), rgba(239, 68, 68, 0.15))',                    boxShadow: '0 0 15px rgba(245, 158, 11, 0.4)'                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.3), rgba(168, 85, 247, 0.3))',

                    border: `2px solid ${readAlerts.has(alert.data._id) ? 'rgba(168, 85, 247, 0.3)' : 'rgba(239, 68, 68, 0.4)'}`,

                    opacity: readAlerts.has(alert.data._id) ? '0.7' : '1',                  }}                    boxShadow: '0 0 15px rgba(245, 158, 11, 0.4)'

                    boxShadow: readAlerts.has(alert.data._id) 

                      ? '0 0 15px rgba(168, 85, 247, 0.2)'                 >                  }}

                      : '0 0 20px rgba(239, 68, 68, 0.3)'

                  }}                  <Bell className="h-6 w-6 text-amber-400 animate-pulse" />                >

                  onClick={() => markAsRead(alert.data._id)}

                >                </div>                  <Bell className="h-6 w-6 text-amber-400 animate-pulse" />

                  <div className="flex items-start justify-between">

                    <div className="flex items-start space-x-4 flex-1">                <div>                </div>

                      <div 

                        className="p-3 rounded-full flex-shrink-0"                  <h4 className="text-xl font-bold" style={{color: 'white !important', textShadow: '0 0 10px rgba(255, 255, 255, 0.5)'}}>                <div>

                        style={{

                          background: readAlerts.has(alert.data._id)                     Monitoring Alerts                  <h4 className="text-xl font-bold" style={{color: 'white !important', textShadow: '0 0 10px rgba(255, 255, 255, 0.5)'}}>

                            ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(168, 85, 247, 0.2))' 

                            : 'linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(249, 115, 22, 0.3))',                  </h4>                    Monitoring Alerts

                          boxShadow: '0 0 10px rgba(239, 68, 68, 0.4)'

                        }}                  <p className="text-xs" style={{color: 'rgba(245, 158, 11, 0.8) !important'}}>                  </h4>

                      >

                        {readAlerts.has(alert.data._id) ? (                    Cosmic Workspace Notifications                  <p className="text-xs" style={{color: 'rgba(245, 158, 11, 0.8) !important'}}>

                          <Bell 

                            className="h-5 w-5"                  </p>                    Cosmic Workspace Notifications

                            style={{color: 'rgba(168, 85, 247, 0.8)'}}

                          />                </div>                  </p>

                        ) : (

                          <AlertTriangle               </div>                </div>

                            className="h-5 w-5"

                            style={{color: 'rgb(248, 113, 113)'}}              {unreadCount > 0 && (              </div>

                          />

                        )}                <Badge             </div>

                      </div>

                      <div className="flex-1 min-w-0">                  className="text-white text-sm px-3 py-1 rounded-full animate-bounce font-bold"          </div>

                        <div className="flex items-center space-x-2 mb-2">

                          <h5 className="font-bold text-base leading-tight" style={{color: 'white'}}>                  style={{        </div>

                            {alert.data.title}

                          </h5>                    background: 'linear-gradient(135deg, #ef4444, #dc2626) !important',

                          {!readAlerts.has(alert.data._id) && (

                            <div                     boxShadow: '0 0 15px rgba(239, 68, 68, 0.6)'        {/* Test Content */}

                              className="w-3 h-3 rounded-full animate-pulse flex-shrink-0"

                              style={{                  }}        <div 

                                backgroundColor: 'rgb(239, 68, 68)',

                                boxShadow: '0 0 8px rgba(239, 68, 68, 0.8)'                >          className="p-5" 

                              }}

                            />                  {unreadCount} new          style={{

                          )}

                        </div>                </Badge>            backgroundColor: 'rgba(10, 10, 15, 0.9) !important',

                        <p className="text-sm leading-relaxed mb-3" style={{color: 'rgba(255, 255, 255, 0.8)'}}>

                          {alert.data.description}              )}            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.05) 0%, transparent 50%)'

                        </p>

                        <p className="text-xs font-mono" style={{color: 'rgba(245, 158, 11, 0.7)'}}>            </div>          }}

                          🕒 {new Date(alert.timestamp).toLocaleString()}

                        </p>            <div className="flex items-center space-x-2">        >

                      </div>

                    </div>              {unreadCount > 0 && (          <div className="text-center py-12">

                    

                    <Button                <Button            <div 

                      variant="ghost"

                      size="sm"                  variant="ghost"              className="mx-auto mb-4 p-4 rounded-full"

                      onClick={(e) => {

                        e.stopPropagation();                  size="sm"              style={{

                        console.log('Delete alert:', alert.data._id);

                      }}                  onClick={() => {                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(168, 85, 247, 0.2))',

                      className="ml-3 p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 flex-shrink-0"

                      style={{                    setReadAlerts(new Set(filteredAlerts.map((a) => a.data._id)));                width: 'fit-content'

                        backgroundColor: 'rgba(239, 68, 68, 0.1)',

                        border: '1px solid rgba(239, 68, 68, 0.3)',                  }}              }}

                        color: 'rgb(239, 68, 68)'

                      }}                  className="text-xs transition-all duration-300 rounded-lg px-3 py-1"            >

                    >

                      <Trash2 className="h-4 w-4" />                  style={{              <Bell className="h-16 w-16" style={{color: 'rgba(245, 158, 11, 0.4)'}} />

                    </Button>

                  </div>                    color: 'rgba(245, 158, 11, 0.9) !important',            </div>

                </div>

              ))                    backgroundColor: 'rgba(245, 158, 11, 0.1) !important',            <h3 className="text-lg font-semibold mb-2" style={{color: 'rgba(255, 255, 255, 0.8) !important'}}>

            )}

          </div>                    border: '1px solid rgba(245, 158, 11, 0.3) !important'              🌌 Cosmic Alert System Test

        </div>

                  }}            </h3>

        {/* Footer */}

        <div                 >            <p className="text-sm" style={{color: 'rgba(255, 255, 255, 0.6) !important'}}>

          className="px-6 py-4 border-t"

          style={{                  ✓ Mark all read              {filteredAlerts.length === 0 ? 'No alerts at the moment' : `${filteredAlerts.length} alerts available`}

            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(245, 158, 11, 0.1))',

            borderTopColor: 'rgba(168, 85, 247, 0.3)'                </Button>            </p>

          }}

        >              )}            <p className="text-xs mt-1" style={{color: 'rgba(245, 158, 11, 0.6) !important'}}>

          <div className="flex items-center justify-between text-xs">

            <p style={{color: 'rgba(255, 255, 255, 0.6)'}}>              {readAlerts.size > 0 && (              If you can see this cosmic design, the styling is working! ✨

              💫 Click alerts to mark as read • 🗑️ Hover to delete

            </p>                <Button            </p>

            <div className="flex items-center space-x-3">

              <span style={{color: 'rgba(245, 158, 11, 0.8)'}}>                  variant="ghost"          </div>

                Total: {monitoringAlerts.length}

              </span>                  size="sm"        </div>

              <span style={{color: 'rgba(239, 68, 68, 0.8)'}}>

                Unread: {unreadCount}                  onClick={deleteAllRead}

              </span>

            </div>                  className="text-xs transition-all duration-300 rounded-lg px-3 py-1"        {/* Footer */}

          </div>

        </div>                  style={{        <div 

      </PopoverContent>

    </Popover>                    color: 'rgba(239, 68, 68, 0.9) !important',          className="px-6 py-4 border-t"

  );

}                    backgroundColor: 'rgba(239, 68, 68, 0.1) !important',          style={{

                    border: '1px solid rgba(239, 68, 68, 0.3) !important'            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(245, 158, 11, 0.1)) !important',

                  }}            borderTopColor: 'rgba(168, 85, 247, 0.3) !important'

                >          }}

                  🗑️ Clear read        >

                </Button>          <p className="text-center text-xs" style={{color: 'rgba(255, 255, 255, 0.6) !important'}}>

              )}            💫 Cosmic alert system v2.0 • Enhanced with space magic

            </div>          </p>

          </div>        </div>

        </div>      </PopoverContent>

    </Popover>

        {/* Enhanced Content Area */}  );

        <div }

          className="p-5" 

          style={{        {/* Enhanced Header with Cosmic Styling */}

            backgroundColor: 'rgba(10, 10, 15, 0.9) !important',        <div 

            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.05) 0%, transparent 50%)'          className="px-6 py-5 border-b relative overflow-hidden"

          }}          style={{

        >            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(245, 158, 11, 0.2), rgba(168, 85, 247, 0.3))',

          <div className="space-y-4 max-h-96 overflow-y-auto">            borderBottomColor: 'rgba(168, 85, 247, 0.3)'

            {filteredAlerts.length === 0 ? (          }}

              <div className="text-center py-12">        >

                <div           {/* Cosmic Background Pattern */}

                  className="mx-auto mb-4 p-4 rounded-full"          <div 

                  style={{            className="absolute inset-0 opacity-20"

                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(168, 85, 247, 0.2))',            style={{

                    width: 'fit-content'              background: 'radial-gradient(circle at 20% 80%, rgba(245, 158, 11, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)'

                  }}            }}

                >          />

                  <Bell className="h-16 w-16" style={{color: 'rgba(245, 158, 11, 0.4)'}} />          <div className="relative z-10">

                </div>            <div className="flex items-center justify-between mb-2">

                <h3 className="text-lg font-semibold mb-2" style={{color: 'rgba(255, 255, 255, 0.8) !important'}}>              <div className="flex items-center space-x-3">

                  All Clear in the Cosmos                <div 

                </h3>                  className="p-2 rounded-full"

                <p className="text-sm" style={{color: 'rgba(255, 255, 255, 0.6) !important'}}>No alerts at the moment</p>                  style={{

                <p className="text-xs mt-1" style={{color: 'rgba(245, 158, 11, 0.6) !important'}}>                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.3), rgba(168, 85, 247, 0.3))',

                  Your cosmic workspace is running smoothly ✨                    boxShadow: '0 0 15px rgba(245, 158, 11, 0.4)'

                </p>                  }}

              </div>                >

            ) : (                  <Bell className="h-6 w-6 text-amber-400 animate-pulse" />

              filteredAlerts.map((alert) => (                </div>

                <div                <div>

                  key={alert.data._id}                  <h4 className="text-xl font-bold" style={{color: 'white', textShadow: '0 0 10px rgba(255, 255, 255, 0.5)'}}>

                  className="group relative p-5 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02]"                    Monitoring Alerts

                  style={{                  </h4>

                    background: readAlerts.has(alert.data._id)                   <p className="text-xs" style={{color: 'rgba(245, 158, 11, 0.8)'}}>

                      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(168, 85, 247, 0.08)) !important'                     Cosmic Workspace Notifications

                      : 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(249, 115, 22, 0.1), rgba(239, 68, 68, 0.15)) !important',                  </p>

                    border: `2px solid ${readAlerts.has(alert.data._id) ? 'rgba(168, 85, 247, 0.3)' : 'rgba(239, 68, 68, 0.4)'} !important`,                </div>

                    opacity: readAlerts.has(alert.data._id) ? '0.7' : '1',              </div>

                    boxShadow: readAlerts.has(alert.data._id)               {unreadCount > 0 && (

                      ? '0 0 15px rgba(168, 85, 247, 0.2)'                 <Badge 

                      : '0 0 20px rgba(239, 68, 68, 0.3)'                  className="text-white text-sm px-3 py-1 rounded-full animate-bounce font-bold"

                  }}                  style={{

                  onClick={() => markAsRead(alert.data._id)}                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',

                >                    boxShadow: '0 0 15px rgba(239, 68, 68, 0.6), 0 0 30px rgba(239, 68, 68, 0.3)'

                  {/* Alert Content */}                  }}

                  <div className="flex items-start justify-between">                >

                    <div className="flex items-start space-x-4 flex-1">                  {unreadCount} new

                      <div                 </Badge>

                        className="p-3 rounded-full flex-shrink-0"              )}

                        style={{            </div>

                          background: readAlerts.has(alert.data._id)             <div className="flex items-center space-x-2">

                            ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(168, 85, 247, 0.2))'               {unreadCount > 0 && (

                            : 'linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(249, 115, 22, 0.3))',                <Button

                          boxShadow: '0 0 10px rgba(239, 68, 68, 0.4)'                  variant="ghost"

                        }}                  size="sm"

                      >                  onClick={() => {

                        {readAlerts.has(alert.data._id) ? (                    setReadAlerts(new Set(filteredAlerts.map((a) => a.data._id)));

                          <Bell                   }}

                            className="h-5 w-5"                  className="text-xs transition-all duration-300 rounded-lg px-3 py-1"

                            style={{color: 'rgba(168, 85, 247, 0.8)'}}                  style={{

                          />                    color: 'rgba(245, 158, 11, 0.9)',

                        ) : (                    backgroundColor: 'rgba(245, 158, 11, 0.1)',

                          <AlertTriangle                     border: '1px solid rgba(245, 158, 11, 0.3)'

                            className="h-5 w-5"                  }}

                            style={{color: 'rgb(248, 113, 113)'}}                  onMouseEnter={(e) => {

                          />                    e.target.style.backgroundColor = 'rgba(245, 158, 11, 0.2)';

                        )}                    e.target.style.boxShadow = '0 0 10px rgba(245, 158, 11, 0.4)';

                      </div>                  }}

                      <div className="flex-1 min-w-0">                  onMouseLeave={(e) => {

                        <div className="flex items-center space-x-2 mb-2">                    e.target.style.backgroundColor = 'rgba(245, 158, 11, 0.1)';

                          <h5 className="font-bold text-base leading-tight" style={{color: 'white !important'}}>                    e.target.style.boxShadow = 'none';

                            {alert.data.title}                  }}

                          </h5>                >

                          {!readAlerts.has(alert.data._id) && (                  ✓ Mark all read

                            <div                 </Button>

                              className="w-3 h-3 rounded-full animate-pulse flex-shrink-0"              )}

                              style={{              {readAlerts.size > 0 && (

                                backgroundColor: 'rgb(239, 68, 68)',                <Button

                                boxShadow: '0 0 8px rgba(239, 68, 68, 0.8)'                  variant="ghost"

                              }}                  size="sm"

                            />                  onClick={deleteAllRead}

                          )}                  className="text-xs transition-all duration-300 rounded-lg px-3 py-1"

                        </div>                  style={{

                        <p className="text-sm leading-relaxed mb-3" style={{color: 'rgba(255, 255, 255, 0.8) !important'}}>                    color: 'rgba(239, 68, 68, 0.9)',

                          {alert.data.description}                    backgroundColor: 'rgba(239, 68, 68, 0.1)',

                        </p>                    border: '1px solid rgba(239, 68, 68, 0.3)'

                        <p className="text-xs font-mono" style={{color: 'rgba(245, 158, 11, 0.7) !important'}}>                  }}

                          🕒 {new Date(alert.timestamp).toLocaleString()}                  onMouseEnter={(e) => {

                        </p>                    e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';

                      </div>                    e.target.style.boxShadow = '0 0 10px rgba(239, 68, 68, 0.4)';

                    </div>                  }}

                                      onMouseLeave={(e) => {

                    {/* Red Delete Button */}                    e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';

                    <Button                    e.target.style.boxShadow = 'none';

                      variant="ghost"                  }}

                      size="sm"                >

                      onClick={(e) => deleteAlert(alert.data._id, e)}                  🗑️ Clear read

                      className="ml-3 p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 flex-shrink-0"                </Button>

                      style={{              )}

                        backgroundColor: 'rgba(239, 68, 68, 0.1) !important',            </div>

                        border: '1px solid rgba(239, 68, 68, 0.3) !important',          </div>

                        color: 'rgb(239, 68, 68) !important'        </div>

                      }}

                    >        {/* Enhanced Content Area */}

                      <Trash2 className="h-4 w-4" />        <div 

                    </Button>          className="p-5" 

                  </div>          style={{

                </div>            backgroundColor: 'rgba(10, 10, 15, 0.9)',

              ))            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.05) 0%, transparent 50%)'

            )}          }}

          </div>        >

        </div>          <div className="space-y-4 max-h-96 overflow-y-auto" style={{scrollbarWidth: 'thin'}}>

            {filteredAlerts.length === 0 ? (

        {/* Enhanced Footer with Stats */}              <div className="text-center py-12">

        <div                 <div 

          className="px-6 py-4 border-t"                  className="mx-auto mb-4 p-4 rounded-full"

          style={{                  style={{

            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(245, 158, 11, 0.1)) !important',                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(168, 85, 247, 0.2))',

            borderTopColor: 'rgba(168, 85, 247, 0.3) !important'                    width: 'fit-content'

          }}                  }}

        >                >

          <div className="flex items-center justify-between text-xs">                  <Bell className="h-16 w-16" style={{color: 'rgba(245, 158, 11, 0.4)'}} />

            <p style={{color: 'rgba(255, 255, 255, 0.6) !important'}}>                </div>

              💫 Click alerts to mark as read • 🗑️ Hover to delete                <h3 className="text-lg font-semibold mb-2" style={{color: 'rgba(255, 255, 255, 0.8)'}}>

            </p>                  All Clear in the Cosmos

            <div className="flex items-center space-x-3">                </h3>

              <span style={{color: 'rgba(245, 158, 11, 0.8) !important'}}>                <p className="text-sm" style={{color: 'rgba(255, 255, 255, 0.6)'}}>No alerts at the moment</p>

                Total: {filteredAlerts.length}                <p className="text-xs mt-1" style={{color: 'rgba(245, 158, 11, 0.6)'}}>

              </span>                  Your cosmic workspace is running smoothly ✨

              <span style={{color: 'rgba(239, 68, 68, 0.8) !important'}}>                </p>

                Unread: {unreadCount}              </div>

              </span>            ) : (

            </div>              filteredAlerts.map((alert) => (

          </div>                <div

        </div>                  key={alert.data._id}

      </PopoverContent>                  className="group relative p-5 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02]"

    </Popover>                  style={{

  );                    background: readAlerts.has(alert.data._id) 

}                      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(168, 85, 247, 0.08))' 
                      : 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(249, 115, 22, 0.1), rgba(239, 68, 68, 0.15))',
                    border: `2px solid ${readAlerts.has(alert.data._id) ? 'rgba(168, 85, 247, 0.3)' : 'rgba(239, 68, 68, 0.4)'}`,
                    opacity: readAlerts.has(alert.data._id) ? '0.7' : '1',
                    boxShadow: readAlerts.has(alert.data._id) 
                      ? '0 0 15px rgba(168, 85, 247, 0.2)' 
                      : '0 0 20px rgba(239, 68, 68, 0.3), 0 0 40px rgba(239, 68, 68, 0.1)'
                  }}
                  onClick={() => markAsRead(alert.data._id)}
                  onMouseEnter={(e) => {
                    if (!readAlerts.has(alert.data._id)) {
                      e.currentTarget.style.borderColor = 'rgba(248, 113, 113, 0.6)';
                      e.currentTarget.style.boxShadow = '0 0 25px rgba(239, 68, 68, 0.4), 0 0 50px rgba(239, 68, 68, 0.2)';
                    } else {
                      e.currentTarget.style.boxShadow = '0 0 20px rgba(168, 85, 247, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!readAlerts.has(alert.data._id)) {
                      e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
                      e.currentTarget.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.3), 0 0 40px rgba(239, 68, 68, 0.1)';
                    } else {
                      e.currentTarget.style.boxShadow = '0 0 15px rgba(168, 85, 247, 0.2)';
                    }
                  }}
                >
                  {/* Alert Content */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div 
                        className="p-3 rounded-full flex-shrink-0"
                        style={{
                          background: readAlerts.has(alert.data._id) 
                            ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(168, 85, 247, 0.2))' 
                            : 'linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(249, 115, 22, 0.3))',
                          boxShadow: readAlerts.has(alert.data._id) 
                            ? '0 0 10px rgba(168, 85, 247, 0.4)' 
                            : '0 0 15px rgba(239, 68, 68, 0.5)'
                        }}
                      >
                        {readAlerts.has(alert.data._id) ? (
                          <Bell 
                            className="h-5 w-5"
                            style={{color: 'rgba(168, 85, 247, 0.8)'}}
                          />
                        ) : (
                          <AlertTriangle 
                            className="h-5 w-5"
                            style={{color: 'rgb(248, 113, 113)'}}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h5 className="font-bold text-base leading-tight" style={{color: 'white'}}>
                            {alert.data.title}
                          </h5>
                          {!readAlerts.has(alert.data._id) && (
                            <div 
                              className="w-3 h-3 rounded-full animate-pulse flex-shrink-0"
                              style={{
                                backgroundColor: 'rgb(239, 68, 68)',
                                boxShadow: '0 0 8px rgba(239, 68, 68, 0.8)'
                              }}
                            />
                          )}
                        </div>
                        <p className="text-sm leading-relaxed mb-3" style={{color: 'rgba(255, 255, 255, 0.8)'}}>
                          {alert.data.description}
                        </p>
                        <p className="text-xs font-mono" style={{color: 'rgba(245, 158, 11, 0.7)'}}>
                          🕒 {new Date(alert.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    {/* Red Delete Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => deleteAlert(alert.data._id, e)}
                      className="ml-3 p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 flex-shrink-0"
                      style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: 'rgb(239, 68, 68)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                        e.target.style.boxShadow = '0 0 15px rgba(239, 68, 68, 0.5)';
                        e.target.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                        e.target.style.boxShadow = 'none';
                        e.target.style.transform = 'scale(1)';
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Cosmic Hover Effect */}
                  <div 
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" 
                    style={{
                      background: 'linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.05) 50%, transparent 100%)'
                    }}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Enhanced Footer with Stats */}
        <div 
          className="px-6 py-4 border-t"
          style={{
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(245, 158, 11, 0.1))',
            borderTopColor: 'rgba(168, 85, 247, 0.3)'
          }}
        >
          <div className="flex items-center justify-between text-xs">
            <p style={{color: 'rgba(255, 255, 255, 0.6)'}}>
              💫 Click alerts to mark as read • 🗑️ Hover to delete
            </p>
            <div className="flex items-center space-x-3">
              <span style={{color: 'rgba(245, 158, 11, 0.8)'}}>
                Total: {filteredAlerts.length}
              </span>
              <span style={{color: 'rgba(239, 68, 68, 0.8)'}}>
                Unread: {unreadCount}
              </span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

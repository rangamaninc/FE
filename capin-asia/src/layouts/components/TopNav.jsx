import { useEffect, useMemo, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import {

  Bell,

  Building2,

  ChevronDown,

  LogOut,

  Menu,

  PanelLeftClose,

  PanelLeftOpen,

  Search,

  User,

} from "lucide-react";

import { getClients, getUserRole } from "../../pages/SignIn/authSlice";

import {

  getSelectedClient,

  setClientGLCodes,

  setClientGLCodesMap,

  setSelectedClient,

} from "../../redux/globalSlice";

import { getGLCodesByClientId } from "../../api/user";

import { clearSessionAndRedirect } from "../../utils/authSession";

import { userSignOut } from "../../pages/SignIn/authSlice";

import ThemeSwitcher from "../../components/shared/ThemeSwitcher";

import { Button } from "../../components/ui/Button";

import {

  DropdownMenu,

  DropdownMenuContent,

  DropdownMenuItem,

  DropdownMenuTrigger,

} from "../../components/ui/Dropdown";

import { Drawer, DrawerContent, DrawerTrigger } from "../../components/ui/Drawer";

import { useNotificationStore } from "../../store/useNotificationStore";

import { useSettingsStore } from "../../store/useSettingsStore";

import MobileNav from "./MobileNav";



/** TopNav — global header with client name, search, notifications, profile. */

export default function TopNav() {

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const clients = useSelector(getClients);

  const selectedClient = useSelector(getSelectedClient);

  const userRole = useSelector(getUserRole);

  const unreadCount = useNotificationStore((state) => state.unreadCount);

  const { globalSearchQuery, setGlobalSearchQuery, sidebarCollapsed, toggleSidebar } =

    useSettingsStore();

  const [selectedClientId, setSelectedClientId] = useState(

    selectedClient?.id

      ? String(selectedClient.id)

      : clients[0]?.id

        ? String(clients[0].id)

        : ""

  );



  useEffect(() => {

    if (selectedClient?.id) {

      setSelectedClientId(String(selectedClient.id));

      return;

    }

    if (clients[0]?.id) {

      setSelectedClientId(String(clients[0].id));

    }

  }, [selectedClient, clients]);



  const activeClient = useMemo(() => {

    return (

      clients.find((client) => String(client.id) === selectedClientId) ||

      selectedClient ||

      clients[0] ||

      null

    );

  }, [clients, selectedClient, selectedClientId]);



  const handleClientChange = async (clientId) => {

    setSelectedClientId(clientId);

    const client = clients.find((item) => String(item.id) === clientId);

    if (!client) return;



    dispatch(setSelectedClient(client));

    const glCodes = await getGLCodesByClientId(clientId);

    const glCodesMap = {};

    glCodes.forEach((glCodeObj) => {

      glCodesMap[glCodeObj.code] = glCodeObj.name;

    });

    dispatch(setClientGLCodesMap(glCodesMap));

    dispatch(setClientGLCodes(glCodes));

  };



  const handleLogout = () => {

    dispatch(userSignOut());

    clearSessionAndRedirect();

    navigate("/");

  };



  return (

    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">

      <div className="flex h-16 items-center gap-3 px-4 md:px-6">

        <Drawer>

          <DrawerTrigger asChild>

            <Button variant="ghost" size="icon" className="xl:hidden">

              <Menu className="h-5 w-5" />

            </Button>

          </DrawerTrigger>

          <DrawerContent side="left" className="p-0">

            <MobileNav />

          </DrawerContent>

        </Drawer>



        <Button

          variant="ghost"

          size="icon"

          className="hidden xl:inline-flex"

          onClick={toggleSidebar}

          aria-label="Toggle sidebar"

        >

          {sidebarCollapsed ? (

            <PanelLeftOpen className="h-5 w-5" />

          ) : (

            <PanelLeftClose className="h-5 w-5" />

          )}

        </Button>



        <Link to="/home" className="text-lg font-bold text-primary xl:hidden">

          CapinAsia

        </Link>



        {activeClient ? (

          <div className="flex min-w-0 items-center gap-2 border-l border-border pl-3 md:gap-3 md:pl-4">

            <Building2 className="hidden h-4 w-4 shrink-0 text-primary sm:block" />

            <span className="hidden text-xs font-medium uppercase tracking-wide text-muted-foreground sm:inline">

              Client

            </span>

            {clients.length > 1 ? (

              <DropdownMenu>

                <DropdownMenuTrigger asChild>

                  <Button

                    variant="ghost"

                    className="h-9 max-w-[280px] gap-1 px-2 font-semibold text-foreground"

                  >

                    <span className="truncate">{activeClient.name}</span>

                    <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />

                  </Button>

                </DropdownMenuTrigger>

                <DropdownMenuContent align="start" className="max-h-64 overflow-y-auto">

                  {clients.map((client) => (

                    <DropdownMenuItem

                      key={client.id}

                      onClick={() => handleClientChange(String(client.id))}

                      className={

                        String(client.id) === selectedClientId

                          ? "bg-lightprimary text-primary"

                          : ""

                      }

                    >

                      {client.name}

                    </DropdownMenuItem>

                  ))}

                </DropdownMenuContent>

              </DropdownMenu>

            ) : (

              <span className="max-w-[280px] truncate text-sm font-semibold text-foreground">

                {activeClient.name}

              </span>

            )}

          </div>

        ) : null}



        <div className="relative ml-auto hidden max-w-sm flex-1 md:block">

          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <input

            type="search"

            value={globalSearchQuery}

            onChange={(event) => setGlobalSearchQuery(event.target.value)}

            placeholder="Search modules, records..."

            className="h-10 w-full rounded-lg border border-border bg-transparent pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"

          />

        </div>



        <ThemeSwitcher />



        <Button variant="ghost" size="icon" aria-label="Notifications">

          <Bell className="h-5 w-5" />

          {unreadCount > 0 ? (

            <span className="absolute ml-3 -mt-3 rounded-full bg-error px-1.5 text-[10px] text-white">

              {unreadCount}

            </span>

          ) : null}

        </Button>



        <DropdownMenu>

          <DropdownMenuTrigger asChild>

            <Button variant="ghost" size="icon" aria-label="User menu">

              <User className="h-5 w-5" />

            </Button>

          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">

            <DropdownMenuItem disabled>{userRole || "User"}</DropdownMenuItem>

            <DropdownMenuItem onClick={handleLogout}>

              <LogOut className="mr-2 h-4 w-4" />

              Logout

            </DropdownMenuItem>

          </DropdownMenuContent>

        </DropdownMenu>

      </div>

    </header>

  );

}



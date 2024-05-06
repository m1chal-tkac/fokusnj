import { SWRConfig } from "swr";
import { Route, Router, Switch, useLocation } from "wouter";
import { Navbar } from "./navbar";
import { Overview } from "./Overview";
import { Create } from "./Create/Create";
import { Settings } from "./Settings";
import { Selected } from "./Selected/Selected";
import { SelectedEdit } from "./Selected/SelectedEdit";
import { Users } from "./Users/Users";
import { UserCreate } from "./Users/UserCreate";
import { UserDelete } from "./Users/UserDelete";

interface Dashboard {
  pathname: string;
}

export function Dashboard({ pathname }: Dashboard) {
  return (
    <Router ssrPath={pathname}>
      <SWRConfig
        value={{
          provider: () => new Map(),
          refreshInterval: 120000,
        }}
      >
        <Navbar />
        <Switch>
          <Route path="/dashboard" component={Overview} />
          <Route path="/dashboard/create" component={Create} />
          <Route path="/dashboard/settings" component={Settings} />
          <Route path="/dashboard/selected" component={Selected} />
          <Route path="/dashboard/selected/edit" component={SelectedEdit} />
          <Route path="/dashboard/users" component={Users} />
          <Route path="/dashboard/users/create" component={UserCreate} />
          <Route path="/dashboard/users/delete" component={UserDelete} />
          <Route
            component={() => {
              const [location] = useLocation();
              window.location.href = location;

              return null;
            }}
          />
        </Switch>
      </SWRConfig>
    </Router>
  );
}

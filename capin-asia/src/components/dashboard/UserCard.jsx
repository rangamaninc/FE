import PropTypes from "prop-types";
import { Avatar, AvatarFallback } from "../ui/Avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

/** UserCard — compact user profile summary widget. */
export default function UserCard({ name, email, role, initials }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarFallback>{initials || name?.slice(0, 2)?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-muted-foreground">{email}</p>
          {role ? <p className="mt-1 text-xs uppercase text-primary">{role}</p> : null}
        </div>
      </CardContent>
    </Card>
  );
}

UserCard.propTypes = {
  name: PropTypes.string,
  email: PropTypes.string,
  role: PropTypes.string,
  initials: PropTypes.string,
};

import { logOut } from "@/app/actions/auth";
import { SimplePage } from "@/components/simple-page";

export default function Suspended() {
  return (
    <SimplePage title="Your account is suspended">
      <p className="m-0">A moderator has suspended this account, so you can&apos;t use the boards or your dashboard right now.</p>
      <form action={logOut}><button className="btn" type="submit">Log out</button></form>
    </SimplePage>
  );
}

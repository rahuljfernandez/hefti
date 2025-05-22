import { Avatar } from "../components/ui/avatar";

export default {
  title: "UI/Avatar",
  component: Avatar,
};

const user = {
  name: "Jane Doe",
  avatarUrl: "https://i.pravatar.cc/150?img=47",
};

export const Basic = () => {
  return (
    <>
      <Avatar className="size-6" src={user.avatarUrl} />
      <Avatar className="size-8" src={user.avatarUrl} />
      <Avatar className="size-10" src={user.avatarUrl} />
    </>
  );
};

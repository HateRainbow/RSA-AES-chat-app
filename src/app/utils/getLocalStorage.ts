export type userData = {
  name: string;
  surname: string;
  avatar: string;
};
export const getUserData = () => {
  const name = localStorage.getItem("name");
  const surname = localStorage.getItem("surname");
  const avatar = localStorage.getItem("avatar");
  if (name === null || surname === null || avatar === null) {
    throw new Error(
      `name: ${typeof name} surname: ${typeof surname} avatar: ${typeof avatar}`
    );
  }
  return { name, surname, avatar };
};

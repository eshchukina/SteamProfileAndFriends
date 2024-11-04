export type ProfileData = {
  steamid: string;
  personaname: string;
  avatarfull: string;
  personastate: number;
};

export type Friend = {
  index: number;
  steamId: string;
  avatar: string;
  friendSince: string;
};

export type FriendInfo = {
  steamId: string;
  avatar: string;
  friendSince: string;
  index: number;
};

export type CustomButtonType = {
  title: string;
  onPress: () => void;
};

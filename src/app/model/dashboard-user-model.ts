export interface Activity {
  text: string;
  time: string;
}


export interface Stat {
  title: string;
  value: string | number;
  iconClass: string;
  iconColor: string;
  isCurrency?: boolean;
}
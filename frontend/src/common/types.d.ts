export type WithDesignProps = {
  className?: string
}

export interface MenuItemProp {
	label: string;
	link: string;
	icon: React.ReactElement;
	children?: MenuItemProp[];
}

import styles from "./HomeSidebar.module.css";

export interface ISidebarChildVO {
    id: string;
    icon: string;
    name: string;
    route: string;
}

export class SidebarChildVO {
    id: string;
    icon: string;
    name: string;
    route: string;

    constructor(props: ISidebarChildVO) {
        this.id = props.id;
        this.icon = props.icon;
        this.name = props.name;
        this.route = props.route;
    }
}
import {
	AntDesign,
	Entypo,
	Feather,
	FontAwesome,
	FontAwesome5,
	Fontisto,
	Foundation,
	Ionicons,
	MaterialCommunityIcons,
	MaterialIcons,
	Octicons,
	SimpleLineIcons,
} from "@expo/vector-icons";
import React from "react";
import Icon from "react-native-remix-icon";

export const IconsType = {
	MaterialCommunityIcons,
	MaterialIcons,
	Ionicons,
	Feather,
	FontAwesome,
	FontAwesome5,
	AntDesign,
	Entypo,
	SimpleLineIcons,
	Octicons,
	Foundation,
	Icon,
	Fontisto,
};

interface IconsProps {
	type?: any;
	name?: string;
	color?: any;
	size?: number;
	style?: any;
	className?: any;
}

const Icons = ({
	type,
	name,
	color,
	size = 24,
	style,
	className,
}: IconsProps) => {
	const fontSize = 24;
	const Tag = type;
	return (
		<>
			{type && name && (
				<Tag
					name={name}
					size={size || fontSize}
					color={color}
					style={style}
					className={className}
				/>
			)}
		</>
	);
};

export default Icons;
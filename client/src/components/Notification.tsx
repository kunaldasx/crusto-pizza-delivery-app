import { useDashboardStore } from "@/store/useDashboardStore";
import { Bell, Diamond, Package, User } from "lucide-react";
import { Badge } from "./ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { formatDistanceToNow } from "date-fns";

const Notification = () => {
	const analytics = useDashboardStore((state) => state.analytics);

	return (
		<Popover>
			<PopoverTrigger className="relative p-2 hover:text-accent transition-all duration-200 rounded-lg">
				<Bell size={25} />
				<span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
			</PopoverTrigger>
			<PopoverContent className="w-full">
				<h3 className="text-sm font-medium mb-4">Recent Activity</h3>
				<div className="space-y-4">
					{[...(analytics?.recentActivity ?? [])]
						.reverse()
						.map((activity, idx) => (
							<div
								key={idx}
								className="flex justify-between items-center gap-6 p-4 bg-card rounded-lg"
							>
								<div className="flex justify-center items-center gap-4 rounded-lg">
									<div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
										{activity.type === "signup" ? (
											<User size={16} />
										) : (
											<Package size={16} />
										)}
									</div>
									<div className="flex-1">
										<p className="text-xs font-medium tracking-wide">
											{activity.type === "signup"
												? `${activity.username} created account`
												: `${activity.username} placed a new order`}
										</p>
										<p className="text-xs text-muted-foreground">
											{activity.type === "signup"
												? "New user registered  "
												: `Order: ${activity.metadata?.orderId}  `}

											<Diamond className="w-2.5 inline" />

											<span className="text-foreground font-medium">
												{activity.type === "signup"
													? "  Email verified"
													: `  ${activity.metadata?.totalItems} item${
															(activity.metadata?.totalItems ?? 1) > 1
																? "s"
																: ""
													  }`}
											</span>
										</p>
										<p className="text-xs text-muted-foreground">
											{formatDistanceToNow(new Date(activity.timestamp), {
												addSuffix: true,
											})}
										</p>
									</div>
								</div>
								<div className="flex flex-col justify-center items-end gap-2">
									{activity.type === "order" && (
										<p className="text-sx text-subtitle font-semibold tracking-wide">
											₹ {activity.metadata?.price.toFixed(2)}
										</p>
									)}

									<Badge className="bg-green-500">
										{activity.type === "signup" ? "Active" : "Pending"}
									</Badge>
								</div>
							</div>
						))}
				</div>
			</PopoverContent>
		</Popover>
	);
};

export default Notification;

import { useDashboardStore } from "@/store/useDashboardStore";
import { Bell, Diamond, Package, Siren, User } from "lucide-react";
import { Badge } from "./ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { formatDistanceToNow } from "date-fns";
import { ActivityCategory } from "@/types/DashboardState";

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
										{activity.type ===
										ActivityCategory.Signup ? (
											<User size={16} />
										) : activity.type ===
										  ActivityCategory.Order ? (
											<Package size={16} />
										) : (
											<Siren size={16} />
										)}
									</div>
									<div className="flex-1">
										<p className="text-xs font-medium tracking-wide">
											{activity.type ===
											ActivityCategory.Signup
												? `${activity.name} created account`
												: activity.type ===
												  ActivityCategory.Order
												? `${activity.name} placed a new order`
												: `${activity.name} is low on stock`}
										</p>
										<p className="text-xs text-muted-foreground">
											{activity.type ===
											ActivityCategory.Signup
												? "New user registered  "
												: activity.type ===
												  ActivityCategory.Order
												? `Order: ${activity.metadata?.id}  `
												: `Ingredient: ${activity.metadata?.id} `}

											<Diamond className="w-2.5 inline" />

											<span className="text-foreground font-medium">
												{activity.type ===
												ActivityCategory.Signup
													? "  Email verified"
													: activity.type ===
													  ActivityCategory.Order
													? `  ${
															activity.metadata
																?.count
													  } item${
															(activity.metadata
																?.count ?? 1) >
															1
																? "s"
																: ""
													  }`
													: ` ${
															activity.metadata
																?.count
													  } unit${
															(activity.metadata
																?.count ?? 1) >
															1
																? "s"
																: ""
													  }`}
											</span>
										</p>
										<p className="text-xs text-muted-foreground">
											{formatDistanceToNow(
												new Date(activity.timestamp),
												{
													addSuffix: true,
												}
											)}
										</p>
									</div>
								</div>
								<div className="flex flex-col justify-center items-end gap-2">
									{activity.type === "order" && (
										<p className="text-sx font-semibold tracking-wide">
											₹{" "}
											{(
												activity.metadata?.price ?? 0
											).toFixed(2)}
										</p>
									)}

									<>
										{activity.type ===
										ActivityCategory.Signup ? (
											<Badge className="bg-green-500">
												Active
											</Badge>
										) : activity.type ===
										  ActivityCategory.Order ? (
											<Badge className="bg-orange-500">
												Pending
											</Badge>
										) : (
											<Badge className="bg-red-500">
												Low Stock
											</Badge>
										)}
									</>
								</div>
							</div>
						))}
				</div>
			</PopoverContent>
		</Popover>
	);
};

export default Notification;

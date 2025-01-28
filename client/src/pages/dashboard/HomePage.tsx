import { Diamond, Loader, Package, Siren, User } from "lucide-react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useDashboardStore } from "@/store/useDashboardStore";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { ActivityCategory } from "@/types/DashboardState";

const HomePage = () => {
	const analytics = useDashboardStore((state) => state.analytics);
	const isLoadingDash = useDashboardStore((state) => state.isLoading);

	const [totalRevenue, setTotalRevenue] = useState("0");

	useEffect(() => {
		if (analytics?.totalOrders) {
			const formatted = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "INR",
			}).format(Math.round(analytics.totalRevenue * 100) / 100);

			setTotalRevenue(formatted);
		}
	}, [analytics]);

	return (
		<section className="min-h-screen bg-section-background relative py-6 px-6 md:px-12">
			<Breadcrumb className="mb-6">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<Link to="/dashboard">Dashboard</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
				</BreadcrumbList>
			</Breadcrumb>

			<p className="inline text-sm tracking-wide font-medium bg-primary-end px-4 py-1 rounded-md">
				Restaurant Control
			</p>

			{/* Main Content */}
			<div className="w-full my-6 md:my-12">
				{isLoadingDash ? (
					<Loader className="w-6 h-6 animate-spin" />
				) : (
					<>
						<div className="bg-popover rounded-xl border-2 p-4 md:p-6 mb-6">
							<h2 className="text-2xl font-bold tracking-wide mb-4">
								Welcome to Your Dashboard
							</h2>
							<p className="text mb-6">
								Everything you need to run smooth operations
							</p>

							{/* Sample Content Cards */}
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								<div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg text-white">
									<h3 className="text-lg font-semibold mb-2">
										Total Users
									</h3>
									<p className="text-3xl font-bold">
										{analytics?.totalUsers}
									</p>
									<p className="text-sm opacity-80">
										+12% from last month
									</p>
								</div>
								<div className="bg-gradient-to-r from-green-500 to-teal-600 p-6 rounded-lg text-white">
									<h3 className="text-lg font-semibold mb-2">
										Revenue
									</h3>
									<p className="text-3xl font-bold">
										{totalRevenue}
									</p>
									<p className="text-sm opacity-80">
										+8% from last month
									</p>
								</div>
								<div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 rounded-lg text-white">
									<h3 className="text-lg font-semibold mb-2">
										Orders
									</h3>
									<p className="text-3xl font-bold">
										{analytics?.totalOrders}
									</p>
									<p className="text-sm opacity-80">
										+15% from last month
									</p>
								</div>
							</div>
						</div>

						{/* Additional Content */}
						<div className="bg-popover rounded-lg border-2 p-6">
							<h3 className="text-xl font-semibold mb-4">
								Recent Activity
							</h3>
							<div className="space-y-4">
								{[...(analytics?.recentActivity ?? [])]
									.reverse()
									.map((activity, idx) => (
										<div
											key={idx}
											className="flex justify-between items-center gap-4 p-4 bg-card rounded-lg"
										>
											<div className="flex justify-center items-center gap-4 rounded-lg">
												<div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
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
													<p className="text-sm font-medium tracking-wide">
														{activity.type ===
														ActivityCategory.Signup
															? `${activity.name} created account`
															: activity.type ===
															  ActivityCategory.Order
															? `${activity.name} placed a new order`
															: `${activity.name} is low on stock`}
													</p>
													<p className="text-sm text-muted-foreground">
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
																		activity
																			.metadata
																			?.count
																  } item${
																		(activity
																			.metadata
																			?.count ??
																			1) >
																		1
																			? "s"
																			: ""
																  }`
																: ` ${
																		activity
																			.metadata
																			?.count
																  } unit${
																		(activity
																			.metadata
																			?.count ??
																			1) >
																		1
																			? "s"
																			: ""
																  }`}
														</span>
													</p>
													<p className="text-xs text-muted-foreground">
														{formatDistanceToNow(
															new Date(
																activity.timestamp
															),
															{
																addSuffix: true,
															}
														)}
													</p>
												</div>
											</div>
											<div className="flex flex-col justify-center items-end gap-2">
												{activity.type ===
													ActivityCategory.Order && (
													<p className="text-sm font-semibold tracking-wide">
														₹{" "}
														{(
															activity.metadata
																?.price ?? 0
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
						</div>
					</>
				)}
			</div>
		</section>
	);
};

export default HomePage;

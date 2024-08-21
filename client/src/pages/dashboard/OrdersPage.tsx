import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Orders from "@/components/dashboard/Orders";
import { useEffect, useState } from "react";
import { useOrderStore } from "@/store/useOrderStore";
import { OrderStatus, OrderType } from "@/types/OrderState";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { Loader } from "lucide-react";

const OrdersPage = () => {
	const allOrders = useOrderStore((state) => state.allOrders);
	const getAllOrders = useOrderStore((state) => state.getAllOrders);
	const isLoadingOrders = useOrderStore((state) => state.isLoading);

	const [activeOrders, setActiveOrders] = useState<OrderType[]>();

	useEffect(() => {
		getAllOrders();
	}, []);

	useEffect(() => {
		if (isLoadingOrders) return;

		const active = allOrders.filter(
			(order) =>
				order.status !== OrderStatus.Delivered &&
				order.status !== OrderStatus.Cancelled
		);

		setActiveOrders(active);
	}, [allOrders, isLoadingOrders]);

	return (
		<section className="min-h-screen bg-section-background relative py-6 px-6 sm:px-12">
			<Breadcrumb className="mb-6">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<Link to="/dashboard">Dashboard</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink className="text-foreground" asChild>
							<Link to="/dashboard/orders">Orders</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
				</BreadcrumbList>
			</Breadcrumb>

			<Tabs defaultValue="active">
				<TabsList>
					<TabsTrigger value="active">Active orders</TabsTrigger>
					<TabsTrigger value="all">All orders</TabsTrigger>
				</TabsList>

				{isLoadingOrders ? (
					<Loader className="w-6 h-6 animate-spin mx-auto my-52" />
				) : (
					<>
						<TabsContent value="active">
							<Orders orders={activeOrders} />
						</TabsContent>
						<TabsContent value="all">
							<Orders orders={allOrders} />
						</TabsContent>
					</>
				)}
			</Tabs>
		</section>
	);
};

export default OrdersPage;

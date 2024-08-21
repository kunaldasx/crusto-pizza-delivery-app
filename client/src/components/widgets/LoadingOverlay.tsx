const LoadingOverlay = () => {
	return (
		<div className="w-full h-full flex justify-center items-center">
			<span className="relative inline-block w-12 h-12 animate-spin rounded-full border-4 border-orange-500/20 border-t-orange-600 after:absolute after:inset-[10%] after:rounded-full after:bg-slate-800"></span>
		</div>
	);
};

export default LoadingOverlay;

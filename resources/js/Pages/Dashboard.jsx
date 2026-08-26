import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';

// --- KOMPONEN KECIL: FAVORITE CATEGORY ---
const FavoriteCategoryCard = ({ title, count, amount }) => {
    const categoryConfigs = {
        'Makan & Minum': { color: "#FFC7A7", icon: "🍔" },
        'Bensin Motor': { color: "#DC2626", icon: "⛽" },
        'Service Motor': { color: "#B2FF5B", icon: "🛠️" },
        'Skincare': { color: "#3B82F6", icon: "✨" },
        'Liburan': { color: "#EB4899", icon: "✈️" },
        'Lain-lain': { color: "#E879F9", icon: "📝" },
    };

    const config = categoryConfigs[title] || { color: "#D1as5DB", icon: "💰" };
    const formattedAmount = amount >= 1000 ? `${(amount / 1000)}k` : amount;

    return (
        <div 
            className="flex items-center p-3 gap-3 w-[239px] h-[68px] rounded-[10px] flex-shrink-0"
            style={{ backgroundColor: config.color }}
        >
            <div className="w-[39px] h-[39px] flex items-center justify-center text-2xl flex-shrink-0">
                {config.icon}
            </div>
            <div className="flex flex-col flex-1 overflow-hidden text-left">
                <span className="text-black font-inter text-[18px] font-semibold leading-tight truncate">{title}</span>
                <div className="flex justify-between items-end w-full">
                    <span className="text-black font-inter text-[12px] font-medium leading-none opacity-80">{count}x</span>
                    <span className="text-black font-inter text-[18px] font-bold leading-none">Rp.{formattedAmount}</span>
                </div>
            </div>
        </div>
    );
};

// --- KOMPONEN KECIL: TRANSACTION ITEM ---
const TransactionItem = ({ title, date, amount, type, category }) => {
    const getIcon = () => {
        const cat = category?.toLowerCase() || '';
        if (cat.includes('makan')) return '🍱';
        if (cat.includes('bensin') || cat.includes('motor')) return '⛽';
        if (cat.includes('skincare')) return '✨';
        if (cat.includes('liburan')) return '✈️';
        return '💰';
    };

    return (
        <div className="flex items-center justify-between px-4 w-full h-[68px] rounded-[10px] border-2 border-[#DC2626] bg-[#FFC7A7] flex-shrink-0">
            <div className="flex items-center gap-3">
                <div className="text-2xl">{getIcon()}</div>
                <div className="flex flex-col items-start">
                    <span className="text-black font-inter text-[16px] font-semibold leading-tight">{title}</span>
                    <span className="text-gray-500 font-inter text-[12px]">
                        {new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                </div>
            </div>
            <div className="text-right">
                <span className={`font-inter text-[18px] font-bold ${type === 'expense' ? 'text-[#DC2626]' : 'text-green-600'}`}>
                    {type === 'expense' ? '-' : '+'}
                    {Number(amount).toLocaleString('id-ID')}
                </span>
            </div>
        </div>
    );
};

// --- KOMPONEN KECIL: WALLET CARD ---
const WalletCard = ({ logo, name, type, balance, norek, account_name }) => (
    <div className="relative flex flex-col items-start p-[14px] gap-[7px] w-[208px] h-[191px] rounded-[18px] bg-[#D9D9D9] shadow-sm flex-shrink-0">
        <div className="absolute top-[5px] right-[20px] w-[31.6px] h-[31.6px]">
            <img src="/assets/boxicons_edit-filled.svg" alt="edit" className="w-full h-full" />
        </div>
        <div className="flex flex-row items-start gap-4">
            <div 
                className="w-[54px] h-[54px] rounded-[30px] bg-cover bg-center bg-white border border-gray-100 flex-shrink-0"
                style={{ backgroundImage: `url(${logo})` }}
            ></div>
            <div className="flex flex-col text-left">
                <p className="text-black text-[8px] font-normal leading-none mb-1 opacity-70 uppercase">{type}</p>
                <h4 className="text-black text-[22px] font-semibold leading-tight w-[110px] break-words">{name}</h4>
            </div>
        </div>
        <div className="flex flex-col text-left mt-auto gap-1">
            <p className="text-black text-[12px] font-normal truncate w-[180px]">
                {account_name || 'Tanpa Nama'}
            </p>
            <p className="text-black text-[24px] font-bold">
                Rp.{new Intl.NumberFormat('id-ID').format(balance)}
            </p>
            <p className="text-black text-[12px] font-normal opacity-60">No rek {norek}</p>
        </div>
    </div>
);

// --- KOMPONEN KECIL: CHART BAR ---
const ChartBar = ({ height, label, active = false }) => (
    <div className="flex flex-col items-center gap-2 h-full">
        <div className="relative w-[32px] h-[150px] bg-gray-50 rounded-t-sm flex items-end overflow-hidden border border-gray-100/50 shadow-inner">
            <div 
                className="w-full rounded-t-sm transition-all duration-500"
                style={{ 
                    height: height,
                    background: active 
                        ? `linear-gradient(180deg, rgba(56, 24, 3, 1) 0%, rgba(117, 77, 53, 1) 100%)` 
                        : `linear-gradient(180deg, #D1D5DB 0%, #F3F4F6 100%)`
                }}
            ></div>
        </div>
        <span className="text-black font-inter text-[16px]">{label}</span>
    </div>
);

// --- KOMPONEN KECIL: CATEGORY CARD (SUDAH DISESUAIKAN) ---
const CategoryCard = ({ iconPath, title, budget, color }) => {
    // Format agar "600000" jadi "600k" seperti di Frame 5.png
    const formattedBudget = budget >= 1000000 
        ? `${(budget / 1000000).toFixed(1)}jt` 
        : `${(budget / 1000)}k`;

    return (
        <div 
            className="flex flex-col items-start p-3 gap-1 w-full min-w-[140px] h-[100px] rounded-[18px] shadow-sm" 
            style={{ backgroundColor: color }}
        >
            <div className="flex items-center gap-2 w-full text-left">
                <img src={`/assets/${iconPath}`} alt="" className="w-5 h-5 object-contain" />
                <span className="text-black font-inter text-[13px] font-bold leading-tight truncate">{title}</span>
            </div>
            <div className="flex flex-col items-start mt-auto text-left">
                <span className="text-black font-inter text-[10px] font-bold opacity-70">Budget</span>
                <span className="text-black font-inter text-[18px] font-extrabold leading-none truncate w-full">
                    Rp.{formattedBudget}
                </span>
            </div>
        </div>
    );
};

// --- MAIN DASHBOARD PAGE ---
export default function Dashboard({ auth, wallets = [], recentTransactions = [], favoriteExpenses = [], chartData = [], budgets = [] }) {
    
    const totalPengeluaran = recentTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard" />
            <style>
                {`
                    .no-scrollbar::-webkit-scrollbar { display: none; }
                    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                `}
            </style>
            
            <div className="flex flex-col items-start gap-6 p-4 w-full">
                
                {/* 1. HEADER SECTION */}
                <div className="flex justify-between items-center px-10 w-[930px] h-[144px] rounded-[18px] bg-white shadow-sm flex-shrink-0">
                    <div className="text-left">
                        <h2 className="text-black font-inter text-[48px] font-bold leading-[58px]">Dashboard</h2>
                        <p className="text-[#808080] font-inter text-[20px] font-semibold">Selamat datang, {auth.user.name}!</p>
                    </div>
                    <div style={{
                        width: '78px',
                        height: '78px',
                        borderRadius: '50%',
                        border: '3px solid #F6D8BC',
                        backgroundImage: auth.user.profile_photo_path 
                            ? `url('/storage/${auth.user.profile_photo_path}')` 
                            : `url('/assets/Group.svg')`,
                        backgroundSize: auth.user.profile_photo_path ? 'cover' : '60%',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundColor: auth.user.profile_photo_path ? 'transparent' : '#E5E7EB', 
                    }}></div>
                </div>

                {/* 2. WALLET SECTION */}
                <div className="w-[930px] overflow-x-auto no-scrollbar py-2">
                    <div className="flex flex-row items-end gap-[32px] min-w-max">
                        {wallets.length > 0 ? (
                            wallets.map((wallet) => (
                                <WalletCard 
                                    key={wallet.id}
                                    logo={wallet.logo ? `/storage/${wallet.logo}` : "/assets/default-bank.png"}
                                    name={wallet.name} 
                                    type={wallet.type} 
                                    balance={wallet.balance} 
                                    norek={wallet.norek} 
                                    account_name={wallet.account_name} 
                                />
                            ))
                        ) : (
                            <div className="p-10 bg-gray-100 rounded-[18px] w-full text-center text-gray-500">
                                Belum ada dompet terdaftar.
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. CHART & CATEGORY SECTION */}
                <div className="flex flex-row items-start gap-[20px] w-[930px]">
                    <div className="w-[552px] h-[338px] bg-white rounded-[18px] p-8 shadow-sm flex flex-col">
                        <h3 className="text-black font-inter text-[24px] font-semibold mb-1 text-left">Total Pengeluaran</h3>
                        <p className="text-black font-inter text-[40px] font-semibold mb-6 text-left">
                            Rp.{totalPengeluaran.toLocaleString('id-ID')}
                        </p>
                        <div className="flex gap-6 flex-1 items-start">
                            <div className="flex flex-col justify-between h-[150px] text-black font-inter text-[16px] pt-1">
                                <span>100k</span><span>80k</span><span>60k</span><span>40k</span><span>20k</span><span>0k</span>
                            </div>
                            <div className="flex flex-1 justify-between items-end h-[185px] border-b border-gray-100 pb-[1px]">
                                {/* FIX: Pastikan chartData selalu diperlakukan sebagai array */}
                                {Array.isArray(chartData) && chartData.map((data, index) => (
                                    <ChartBar 
                                        key={index} 
                                        height={data.height || '10%'} 
                                        label={data.label} 
                                        active={new Date().getDay() === (index + 1) % 7} 
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    {/* BAGIAN JENIS PENGELUARAN DINAMIS */}
                    <div className="w-[359px] h-[338px] bg-white rounded-[18px] p-6 shadow-sm flex flex-col">
                        <h3 className="text-black font-inter text-[24px] font-semibold mb-4 text-left">Jenis Pengeluaran</h3>
                        <div className="grid grid-cols-2 gap-3 overflow-y-auto no-scrollbar w-full">
                            {budgets && budgets.length > 0 ? (
                                budgets.map((b, index) => {
                                    const iconMap = {
                                        'Makan & Minum': 'mdi_food.svg',
                                        'Service Motor': 'fa7-solid_motorcycle.svg',
                                        'Bensin Motor': 'mingcute_oil-fill.svg',
                                        'Liburan': 'material-symbols_trip.svg',
                                        'Skincare': 'streamline-ultimate_body-care-cream-bold.svg',
                                        'Lain-lain': 'boxicons_pen-filled.svg'
                                    };

                                    const cardColors = ["#FFC7A7", "#B2FF5B", "#DC2626", "#EB4899", "#3B82F6", "#E879F9"];

                                    return (
                                        <CategoryCard 
                                            key={b.id}
                                            iconPath={iconMap[b.category_name] || 'boxicons_pen-filled.svg'}
                                            title={b.category_name}
                                            budget={b.limit_amount}
                                            color={cardColors[index % cardColors.length]}
                                        />
                                    );
                                })
                            ) : (
                                <div className="col-span-2 text-center py-10 text-gray-400 italic text-sm">
                                    Belum ada budget.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 4. RIWAYAT & FAVORIT */}
                <div className="flex flex-row items-start gap-[24px] w-[930px] mb-10 text-left">
                    <div className="w-[470px] h-[338px] bg-white rounded-[18px] p-6 shadow-sm flex flex-col">
                        <h3 className="text-black font-inter text-[24px] font-semibold mb-6">Riwayat Transaksi</h3>
                        <div className="flex flex-col items-start gap-[11px] w-full overflow-y-auto no-scrollbar">
                            {recentTransactions.length > 0 ? (
                                recentTransactions.map((tr) => (
                                    <TransactionItem 
                                        key={tr.id}
                                        title={tr.description || tr.category} 
                                        date={tr.date} 
                                        amount={tr.amount}
                                        type={tr.type}
                                        category={tr.category}
                                    />
                                ))
                            ) : (
                                <div className="text-center w-full py-10 text-gray-400 italic">
                                    Belum ada transaksi terbaru.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="w-[436px] h-[338px] bg-white rounded-[18px] p-6 shadow-sm flex flex-col">
                        <h3 className="text-black font-inter text-[24px] font-semibold mb-6">Pengeluaran Favorit</h3>
                        <div className="flex flex-col items-center justify-start gap-4 overflow-y-auto no-scrollbar">
                            {Array.isArray(favoriteExpenses) && favoriteExpenses.length > 0 ? (
                                favoriteExpenses.map((fav, index) => (
                                    <FavoriteCategoryCard 
                                        key={index}
                                        title={fav.category}
                                        count={fav.total_count}
                                        amount={fav.total_amount}
                                    />
                                ))
                            ) : (
                                <div className="text-center w-full py-10 text-gray-400 italic">
                                    Belum ada data favorit.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
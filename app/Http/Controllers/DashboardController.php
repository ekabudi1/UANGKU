<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Transaction; 
use App\Models\Wallet;
use App\Models\Budget; // Tambahkan Model Budget
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $userId = auth()->id();
        $currentMonth = now()->month;
        $currentYear = now()->year;
        
        // --- LOGIKA CHART DATA ---
        $days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        $chartData = [];
        
        foreach ($days as $index => $day) {
            $total = Transaction::where('user_id', $userId)
                ->where('type', 'expense')
                ->whereRaw("strftime('%w', date) = ?", [(string)$index])
                ->sum('amount');
                
            $chartData[] = [
                'label' => $day,
                'amount' => $total,
                'height' => min(($total / 100000) * 100, 100) . '%' 
            ];
        }

        // --- LOGIKA BUDGET (UNTUK JENIS PENGELUARAN) ---
        // Ambil data dari tabel Budget agar sinkron dengan halaman Budgeting
        $dbBudgets = Budget::where('user_id', $userId)
            ->where('month', $currentMonth)
            ->where('year', $currentYear)
            ->get();

        $budgets = $dbBudgets->map(function ($budget) use ($userId, $currentMonth, $currentYear) {
            $spent = Transaction::where('user_id', $userId)
                ->where('category', $budget->category_name)
                ->whereMonth('date', $currentMonth)
                ->whereYear('date', $currentYear)
                ->sum('amount');

            return [
                'category_name' => $budget->category_name,
                'limit_amount' => (float)$budget->limit_amount,
                'spent' => (float)$spent,
                'color' => '#FFC7A7', // Warna default sesuai desain
            ];
        });

        // --- LOGIKA PENGELUARAN FAVORIT (OPSIONAL) ---
        $favoriteExpenses = Transaction::select(
                'category', 
                DB::raw('count(*) as total_count'), 
                DB::raw('sum(amount) as total_amount')
            )
            ->where('user_id', $userId)
            ->where('type', 'expense')
            ->groupBy('category')
            ->orderByDesc('total_count')
            ->limit(3)
            ->get();

        return Inertia::render('Dashboard', [
            'wallets' => Wallet::where('user_id', $userId)->get(),
            'recentTransactions' => Transaction::where('user_id', $userId)->latest()->limit(5)->get(),
            'chartData' => $chartData,
            'budgets' => $budgets, // KIRIM DATA BUDGET INI KE DASHBOARD
            'favoriteExpenses' => $favoriteExpenses,
        ]);
    }
}
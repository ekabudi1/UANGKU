<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Transaction;
use App\Models\Budget;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class LaporanController extends Controller
{
    public function index(Request $request, $filter = 'month', $date = null)
    {
        $userId = auth()->id();
        
        // Ambil filter dan date dari parameter atau request
        $filter = $request->query('filter', $filter);
        $dateParam = $request->query('date', $date ?? now()->format('Y-m-d'));
        $carbonDate = Carbon::parse($dateParam);

        // --- Logic Navigasi Waktu ---
        if ($filter === 'week') {
            $start = $carbonDate->copy()->startOfWeek();
            $end = $carbonDate->copy()->endOfWeek();
            
            // Tanggal untuk navigasi
            $prevDate = $carbonDate->copy()->subWeek()->format('Y-m-d');
            $nextDate = $carbonDate->copy()->addWeek()->format('Y-m-d');
            
            $labelHalaman = $start->format('d M') . " - " . $end->format('d M') . " " . $start->format('Y');
            
            // Query Transaksi Mingguan
            $query = Transaction::where('user_id', $userId)
                ->where('type', 'expense')
                ->whereBetween('date', [$start->format('Y-m-d'), $end->format('Y-m-d')]);
        } else {
            // Tanggal untuk navigasi
            $prevDate = $carbonDate->copy()->subMonth()->format('Y-m-d');
            $nextDate = $carbonDate->copy()->addMonth()->format('Y-m-d');
            
            $labelHalaman = $carbonDate->translatedFormat('F Y');
            
            // Query Transaksi Bulanan
            $query = Transaction::where('user_id', $userId)
                ->where('type', 'expense')
                ->whereMonth('date', $carbonDate->month)
                ->whereYear('date', $carbonDate->year);
        }

        // --- 1. Total Uang Keluar ---
        $totalSpent = $query->sum('amount');

        // --- 2. Top 3 Pengeluaran Favorit ---
        $topExpenses = (clone $query)
            ->select('category', DB::raw('sum(amount) as total_amount'))
            ->groupBy('category')
            ->orderByDesc('total_amount')
            ->limit(3)
            ->get();

        // --- 3. Logic Kesehatan Keuangan ---
        $budgets = Budget::where('user_id', $userId)
            ->where('month', $carbonDate->month)
            ->where('year', $carbonDate->year)
            ->get();

        $overBudgetCount = 0;
        foreach ($budgets as $b) {
            $actualSpent = Transaction::where('user_id', $userId)
                ->where('category', $b->category_name)
                ->whereMonth('date', $carbonDate->month)
                ->whereYear('date', $carbonDate->year)
                ->sum('amount');
            
            if ($actualSpent > $b->limit_amount) {
                $overBudgetCount++;
            }
        }

        $totalCategories = $budgets->count();
        $isUnhealthy = ($totalCategories > 0) ? ($overBudgetCount / $totalCategories > 0.5) : false;
        $healthStatus = $isUnhealthy ? "Tidak Sehat" : "Sehat";

        return Inertia::render('Laporan/Index', [
            'topExpenses' => $topExpenses,
            'totalSpent' => (float)$totalSpent,
            'healthStatus' => $healthStatus,
            'labelHalaman' => $labelHalaman,
            'filters' => [
                'currentFilter' => $filter,
                'currentDate' => $dateParam,
                'prevDate' => $prevDate,
                'nextDate' => $nextDate,
            ]
        ]);
    }
}
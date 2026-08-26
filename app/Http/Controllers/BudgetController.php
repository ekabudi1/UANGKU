<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use App\Models\Wallet;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class BudgetController extends Controller
{
    public function index()
    {
        $userId = auth()->id();
        $currentMonth = now()->month;
        $currentYear = now()->year;

        $dbBudgets = Budget::where('user_id', $userId)
            ->where('month', $currentMonth)
            ->where('year', $currentYear)
            ->get();

        $budgets = $dbBudgets->map(function ($budget) use ($userId, $currentMonth, $currentYear) {
            $actualSpent = Transaction::where('user_id', $userId)
                ->where('category', $budget->category_name)
                ->whereMonth('date', $currentMonth)
                ->whereYear('date', $currentYear)
                ->sum('amount');

            $percentage = $budget->limit_amount > 0 
                ? round(($actualSpent / $budget->limit_amount) * 100, 1) : 0;

            return [
                'id' => $budget->id,
                'category_name' => $budget->category_name,
                'limit_amount' => (float)$budget->limit_amount,
                'spent' => (float)$actualSpent,
                'icon' => 'mdi_money.svg', 
                'color' => '#FFC7A7',
                'percentage' => $percentage,
                'is_over' => $actualSpent > $budget->limit_amount, // Tambahkan ini untuk UI
            ];
        });

        return Inertia::render('Budgeting/Index', [
            'auth' => ['user' => auth()->user()],
            'wallets' => Wallet::where('user_id', $userId)->get(),
            'budgets' => $budgets,
            'chartData' => $this->getChartData($userId),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'category_name' => 'required|string|max:255',
            'limit_amount' => 'required|numeric|min:0',
        ]);

        Budget::updateOrCreate(
            [
                'user_id' => auth()->id(),
                'category_name' => $request->category_name,
                'month' => now()->month,
                'year' => now()->year,
            ],
            ['limit_amount' => $request->limit_amount]
        );

        return redirect()->back()->with('message', 'Budget berhasil disimpan!');
    }

    private function getChartData($userId)
    {
        $days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
        return collect($days)->map(fn($day) => ['day' => $day, 'amount' => rand(10000, 90000)]);
    }
}
<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionController extends Controller
{
    /**
     * Menampilkan halaman riwayat transaksi
     */
    public function index()
    {
        return Inertia::render('Transaksi/Index', [
            'transactions' => Transaction::with('wallet')
                ->where('user_id', auth()->id())
                ->orderBy('date', 'desc')
                ->get(),
            'wallets' => Wallet::where('user_id', auth()->id())->get(),
        ]);
    }

    /**
     * Menyimpan transaksi baru dan update saldo dompet
     */
    public function store(Request $request)
    {
        // 1. Validasi
        $request->validate([
            'wallet_id' => 'required|exists:wallets,id',
            'type' => 'required|in:income,expense',
            'amount' => 'required|numeric|min:1',
            'category' => 'required|string|max:255',
            'date' => 'required|date',
            'description' => 'nullable|string',
        ]);

        // 2. Buat Transaksi
        Transaction::create([
            'user_id' => auth()->id(),
            'wallet_id' => $request->wallet_id,
            'type' => $request->type,
            'amount' => $request->amount,
            'category' => $request->category,
            'date' => $request->date,
            'description' => $request->description,
        ]);

        // 3. Update Saldo di Tabel Wallet
        $wallet = Wallet::find($request->wallet_id);
        if ($request->type === 'income') {
            $wallet->balance += $request->amount;
        } else {
            $wallet->balance -= $request->amount;
        }
        $wallet->save();

        return redirect()->route('transaksi.index')->with('success', 'Transaksi berhasil dicatat!');
    }
    /**
     * Memperbarui data transaksi dan menyesuaikan saldo dompet
     */
    public function update(Request $request, $id)
    {
        // 1. Validasi data
        $request->validate([
            'wallet_id' => 'required|exists:wallets,id',
            'type' => 'required|in:income,expense',
            'amount' => 'required|numeric|min:1',
            'category' => 'required|string|max:255',
            'date' => 'required|date',
            'description' => 'nullable|string',
        ]);

        // 2. Ambil data transaksi lama & dompet terkait
        $transaction = Transaction::findOrFail($id);
        $wallet = Wallet::find($transaction->wallet_id);

        // 3. KEMBALIKAN saldo dompet ke kondisi sebelum transaksi ini ada
        if ($transaction->type === 'income') {
            $wallet->balance -= $transaction->amount;
        } else {
            $wallet->balance += $transaction->amount;
        }

        // 4. Update data transaksi dengan data baru
        $transaction->update([
            'wallet_id' => $request->wallet_id,
            'type' => $request->type,
            'amount' => $request->amount,
            'category' => $request->category,
            'date' => $request->date,
            'description' => $request->description,
        ]);

        // 5. TERAPKAN saldo baru berdasarkan data yang di-edit
        // Ambil dompet baru (jika user ganti dompet saat edit)
        $newWallet = Wallet::find($request->wallet_id);
        if ($request->type === 'income') {
            $newWallet->balance += $request->amount;
        } else {
            $newWallet->balance -= $request->amount;
        }
        
        // Simpan saldo dompet (lama jika tetap, baru jika berubah)
        $wallet->save();
        if ($wallet->id !== $newWallet->id) {
            $newWallet->save();
        }

        return redirect()->route('transaksi.index')->with('success', 'Transaksi berhasil diperbarui!');
    }
}
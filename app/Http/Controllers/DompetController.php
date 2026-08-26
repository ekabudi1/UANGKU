<?php

namespace App\Http\Controllers;

use App\Models\Wallet; // Pastikan kamu sudah buat Model Wallet
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class DompetController extends Controller
{
    /**
     * Menampilkan halaman utama dompet
     */
    public function index()
    {
        return Inertia::render('Dompet/Index', [
            // Mengambil semua data dompet milik user yang sedang login
            'wallets' => Wallet::where('user_id', auth()->id())->get()
        ]);
    }

    /**
     * Menyimpan dompet baru dari modal
     */
    public function store(Request $request)
        {
            $request->validate([
                'name' => 'required',
                'type' => 'required',
                'balance' => 'required|numeric', // Tambahkan numeric biar aman
                'norek' => 'required',
                'logo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
                'account_name' => 'nullable|string',
            ]);

            $path = null;
            if ($request->hasFile('logo')) {
                // Simpan di storage/app/public/wallets
                $path = $request->file('logo')->store('wallets', 'public');
            }

            Wallet::create([
                'user_id' => auth()->id(),
                'name' => $request->name,
                'type' => $request->type,
                'balance' => $request->balance, 
                'norek' => $request->norek,
                'logo' => $path, // SEBELUMNYA BARIS INI HILANG, MAKANYA FOTO GAK MUNCUL
                'account_name' => $request->account_name,
            ]);

            return redirect()->route('dompet.index');
        }

        /**
         * Update data dompet yang sudah ada.
         */
        public function update(Request $request, Wallet $wallet)
        {
            // 1. Pastikan dompet ini milik user yang login
            if ($wallet->user_id !== auth()->id()) {
                abort(403, 'Aksi tidak diizinkan.');
            }

            // 2. Validasi Input
            $request->validate([
                'name' => 'required|string|max:255',
                'type' => 'required|string',
                'account_name' => 'required|string|max:255',
                'balance' => 'required|numeric',
                'norek' => 'required|string|max:255',
                'logo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048', // Nullable jika logo tak diganti
            ]);

            // 3. Persiapkan data yang akan diupdate
            $dataToUpdate = [
                'name' => $request->name,
                'type' => $request->type,
                'account_name' => $request->account_name,
                'balance' => $request->balance,
                'norek' => $request->norek,
            ];

            // 4. Handle Upload Logo Baru (Jika ada)
            if ($request->hasFile('logo')) {
                // Hapus file lama
                if ($wallet->logo && Storage::disk('public')->exists($wallet->logo)) {
                    Storage::disk('public')->delete($wallet->logo);
                }
                // Simpan file baru
                $dataToUpdate['logo'] = $request->file('logo')->store('wallets', 'public');
            }

            // 5. Update data ke Database
            $wallet->update($dataToUpdate);

            return redirect()->route('dompet.index')->with('success', 'Dompet updated!');
        }


        public function destroy(Wallet $wallet)
        {
            // Cek biar gak bisa hapus dompet orang lain
            if ($wallet->user_id !== auth()->id()) {
                abort(403, 'Aksi tidak diizinkan.');
            }

            // Hapus file logo dari storage biar folder kamu gak penuh sampah
            if ($wallet->logo && \Illuminate\Support\Facades\Storage::disk('public')->exists($wallet->logo)) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($wallet->logo);
            }

            $wallet->delete();

            return redirect()->route('dompet.index')->with('success', 'Dompet berhasil dihapus!');
        }
        
}
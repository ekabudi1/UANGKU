<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        
        // 1. Ambil data yang sudah divalidasi
        $user->fill($request->validated());

        // 2. Handle Update Occupation (Pekerjaan)
        if ($request->has('occupation')) {
            $user->occupation = $request->occupation;
        }

        // 3. Handle Update Foto Profil (Poin 6)
        if ($request->hasFile('photo')) {
            // Hapus foto lama jika ada
            if ($user->profile_photo_path) {
                Storage::disk('public')->delete($user->profile_photo_path);
            }

            // Simpan foto baru ke folder 'profile-photos' di disk 'public'
            $path = $request->file('photo')->store('profile-photos', 'public');
            $user->profile_photo_path = $path;
        }

        // 4. Handle Update Password (Poin 4 & 5)
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        // Reset email verification jika email ganti
        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        // Redirect balik ke halaman setting profile kamu
        return Redirect::back()->with('status', 'profile-updated');
    }

    public function destroy(Request $request): RedirectResponse
    {
        // Validasi password sebelum hapus akun
        $request->validate([
            'password' => ['required', 'current_password'],
        ], [
            'password.current_password' => 'Password yang Anda masukkan salah.',
        ]);

        $user = $request->user();

        // Logout user
        Auth::logout();

        // Hapus file foto dari storage
        if ($user->profile_photo_path) {
            Storage::disk('public')->delete($user->profile_photo_path);
        }

        // Hapus data user dari database
        $user->delete();

        // Hancurkan session
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
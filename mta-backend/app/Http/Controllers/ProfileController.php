<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    public function updateAvatar(Request $request)
    {
        // 1. Validation: تأكد بلي كاين تصويرة وبلي الحجم ديالها معقول
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg|max:2048', // 2 ميغا ماكسيموم
        ]);

        $user = $request->user();

        // 2. إيلا كان ديجا عندو تصويرة قديمة، نمسحوها باش ما نعمروش السيرفر
        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            Storage::disk('public')->delete($user->avatar);
        }

        // 3. نحفضو التصويرة الجديدة فـ storage/app/public/avatars
        // هادي غتعطيها سمية عشوائية بوحدها باش ما يتخالطوش
        $path = $request->file('avatar')->store('avatars', 'public');

        // 4. نسجلو السمية الجديدة فـ الداتابيز
        $user->avatar = $path;
        $user->save();

        // 5. نردو الرابط الجديد لـ React
        return response()->json([
            'message' => 'Avatar mis à jour avec succès',
            'avatar_url' => asset('storage/' . $path)
        ]);
    }
    public function updatePassword(Request $request)
    {
        // 1. الفحص (Validation)
        $request->validate([
            'current_password' => 'required',
            // confirmed كتعني بلي لارافيل غيقلب أوتوماتيك على حقل سميتو new_password_confirmation
            'new_password' => 'required|min:8|confirmed',
        ]);

        $user = $request->user();

        // 2. التأكد من أن المودپاس القديم صحيح
        // Hash::check كتقارن داكشي لي كتب اليوزر مع داكشي لي مشيفري فـ الداتابيز
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Le mot de passe actuel est incorrect.'
            ], 400); // 400 = Bad Request (خطأ من عند المستخدم)
        }

        // 3. تحديث المودپاس وتشفيره
        $user->password = Hash::make($request->new_password);
        $user->save();

        // 4. إرجاع رسالة النجاح
        return response()->json([
            'message' => 'Mot de passe mis à jour avec succès.'
        ]);
    }
}

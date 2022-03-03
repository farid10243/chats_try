<?php

namespace App\Http\Middleware;

use App\Http\Resources\UserResource;
use App\Models\Chat;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    public function version(Request $request)
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function share(Request $request)
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => fn () => auth()->check() ? new UserResource(auth()->user()) : '',
            ],
            'users' => fn () => auth()->check() ? Chat::with('userOne', 'userTwo')->where('user_1', auth()->id())->orWhere('user_2', auth()->id())->get(): '', // menggunakan function agar tidak diload ulang ketika pindah halaman tapi kayanya ga ngaruh
        ]);
    }
}

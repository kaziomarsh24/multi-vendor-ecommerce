<?php

namespace App\Http\Controllers;

use App\Services\HomeService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __construct(
        protected HomeService $homeService
    ) {}

    // Render storefront home page with cached catalog and shop data
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $category = $request->query('category');

        return Inertia::render('Home', $this->homeService->getHomeData($search, $category));
    }
}

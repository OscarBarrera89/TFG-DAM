<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function show()
    {
        return Category::all();
    }

    public function store(Request $request)
    {
        $this->authorize('create', Category::class); // Solo admin
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'photo' => 'nullable|string',
            'order' => 'integer',
        ]);

        $category = Category::create($validated);
        return response()->json($category, 201);
    }

    public function update(Request $request, Category $category)
    {
        $this->authorize('update', $category);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'photo' => 'nullable|string',
            'order' => 'integer',
        ]);

        $category->update($validated);
        return $category;
    }

    public function destroy(Category $category)
    {
        $this->authorize('delete', $category); // Solo admin
        $category->delete();
        return response()->json(['message' => 'Category deleted']);
    }
}
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


class ProductController extends Controller
{
   public function show(){
        return Product::all();
    }

    public function store(Request $request){
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'image' => 'required|string',
        ]);
        return Product::create($validated);
    }

    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'required|string',
                'price' => 'required|numeric|min:0',
                'category_id' => 'required|exists:categories,id',
                'image' => 'required|string',
            ]);
        } catch (ValidationException $e) {
            Log::error('Validation failed: ' . json_encode($e->errors()));
            return response()->json(['message' => 'Validación fallida', 'errors' => $e->errors()], 422);
        }

        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Producto no encontrado'], 404);
        }

        try {
            $product->update($validated);
            return response()->json($product, 200);
        } catch (\Exception $e) {
            Log::error('Error updating product ID: ' . $id . ' - ' . $e->getMessage());
            return response()->json(['message' => 'Error al actualizar el producto: ' . $e->getMessage()], 500);
        }
    }

    public function showOne($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Producto no encontrado'], 404);
        }

        return response()->json($product);
    }

   public function destroy($id)
    {
        $product = Product::find($id);

        if (!$product) {
            Log::error('Producto con ID: ' . $id . ' no encontrado');
            return response()->json(['message' => 'Producto no encontrado'], 404);
        }

        try {
            $product->forceDelete();
            Log::info('Producto Eliminado: ' . $id);
            return response()->noContent();
        } catch (\Exception $e) {
            Log::error('Error eliminando el producto con ID: ' . $id . ' - ' . $e->getMessage());
            return response()->json(['message' => 'Error al eliminar el producto: ' . $e->getMessage()], 500);
        }
    }
}
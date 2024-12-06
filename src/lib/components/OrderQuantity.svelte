<script>
    import { quantity } from "$lib/stores";

    function increaseQuantity() {
      $quantity += 1;
    }
    
    function decreaseQuantity() {
      if ($quantity > 1) {
        $quantity -= 1;
      }
    }
  </script>
  <div class="container text-center mt-3">
    <div class="row justify-content-center">
      <div class="col-auto">
        <p class="fw-bold">Quantity:</p>
        <div class="d-flex align-items-center gap-2">
          <button type="button" class="btn btn-secondary" on:click={decreaseQuantity}>-</button>
          <input
            type="number"
            bind:value={$quantity}
            min="1"
            class="form-control text-center"
            style="width: 60px;"
          />
          <button type="button" class="btn btn-secondary" on:click={increaseQuantity}>+</button>
        </div>
      </div>
    </div>
  </div>
  
  <style>
    input[type="number"] {
      -moz-appearance: textfield;
    }
    input::-webkit-inner-spin-button, 
    input::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  </style>
  
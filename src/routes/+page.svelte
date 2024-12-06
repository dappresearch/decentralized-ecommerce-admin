<script>
  import { loadContract, connectWallet, decryptForm, orderStatus} from "$lib/helpers";
  import { provider } from "$lib/stores";
  import onboard from "$lib/onboard.js";
  import Spinner from "$lib/components/Spinner.svelte";
  
  const privKey = import.meta.env.VITE_PRIVATE_KEY;

  let newTotalStock=0;
  let newPrice=0;
  let newShippingCost=0;
  let publicKey;
  let newOwner;
  let newAdmin;
  let oldAdmin;

  let currentOwner;
  let totalPayment;
  let amountAfterShipping;
  let totalWithdraw;
  let totalStock;
  let orderNo;
  let totalOrder;

  let orderDetails = {
    quantity: 0,
    amount: 0,
    buyerAddr: "",
    purchaseDate: 0,
    shippingAddr: "",
    status: "",
  };

  let loadingOrders = false;

  let decryptAddr;

  const isWalletConnected = async () => {
    if (!$provider) {
      await onboard.connectWallet();
      return;
    }

    const { contract, defaultAccount } = await loadContract($provider);

    return {
      contract,
      defaultAccount,
    };
  };

  const getOrder = async () => {
    const { contract, defaultAccount } = await isWalletConnected();

    // Show loading spinner.
    loadingOrders = true;

    // Empty order details.
    orderDetails = {};
    decryptAddr = "";

    try {
      orderDetails = await contract.methods.getOrderDetails(orderNo).call();

      decryptAddr = await decryptForm(orderDetails.shippingAddr, privKey);

      const owner = await contract.methods.owner().call();

    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      loadingOrders = false;
    }
  };

  const processOrder = async () => {
    const { contract, defaultAccount } = await isWalletConnected();

    try {
      await contract.methods
        .processShipment(orderNo)
        .send({ from: defaultAccount });
    } catch (error) {
      console.error("Error processing order:", error);
    }
  };

  const cancelOrder = async () => {
    const { contract, defaultAccount } = await isWalletConnected();
  
    if (!orderNo) {
      console.error("Order number is required to cancel the order.");
      return;
    }
  
    try {
      await contract.methods
        .setCancelAndRefund(orderNo)
        .send({ from: defaultAccount });
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  };

  const withdraw = async () => {
    const { contract, defaultAccount } = await isWalletConnected();

    try {
      await contract.methods.withdraw().send({ from: defaultAccount });
    } catch (error) {
      console.error("Error withdrawing:", error);
    }
  };

  const handleSetStock = async () => {
    const { contract, defaultAccount } = await isWalletConnected();

    await contract.methods
      .setStock(newTotalStock)
      .send({ from: defaultAccount });
  };

  const handleSetPrice = async () => {
    const { contract, defaultAccount } = await isWalletConnected();

    await contract.methods.setPrice(newPrice).send({ from: defaultAccount });
  };

  const handleSetShippingCost = async () => {
    const { contract, defaultAccount } = await isWalletConnected();

    await contract.methods
      .setShippingCost(newShippingCost)
      .send({ from: defaultAccount });
  };

  const handleSetPublicKey = async () => {
    const { contract, defaultAccount } = await isWalletConnected();

    await contract.methods
      .setPublicKey(publicKey)
      .send({ from: defaultAccount });
  };

  const handleSetOwner = async () => {
    const { contract, defaultAccount } = await isWalletConnected();

    await contract.methods
      .transferOwnership(newOwner)
      .send({ from: defaultAccount });
  };

  const getTotalWithdraw = async () => {
    const { contract } = await isWalletConnected();

    totalWithdraw = await contract.methods.totalWithdraw().call();
  };

  const getAmountAfterShipping = async () => {
    const { contract } = await isWalletConnected();

    amountAfterShipping = await contract.methods.amountAfterShipping().call();
  };

  const getTotalPayment = async () => {
    const { contract } = await isWalletConnected();

    totalPayment = await contract.methods.totalPayment().call();
  };

  const getOwner = async () => {
    const { contract } = await isWalletConnected();

    currentOwner = await contract.methods.owner().call();
  };

  const getTotalStock = async () => {
    const { contract } = await isWalletConnected();

    totalStock = await contract.methods.totalStock().call();
  };

  const getTotalOrder = async () => {
    const { contract } = await isWalletConnected();

    totalOrder = await contract.methods.orderNo().call();
  };

  const handleSetAdmin = async () => {
    const { contract, defaultAccount } = await isWalletConnected();

    await contract.methods
      .setAdmin(newAdmin, true)
      .send({ from: defaultAccount });
  };

  const handleRemoveAdmin = async () => {
    const { contract, defaultAccount } = await isWalletConnected();

    await contract.methods
      .setAdmin(oldAdmin, false)
      .send({ from: defaultAccount });
  };

</script>

  <div class="container mt-4" style="max-width: 600px;">
    <section>
    <div class="row g-2 mt-4 align-items-end">
      <div class="col-auto">
        <label for="stock" class="form-label">Order No</label>
        <input
          type="number"
          id="orderNo"
          name="orderNo"
          class="form-control"
          style="width: 100px;"
          bind:value={orderNo}
        />
      </div>
      <div class="col-auto">
        <button class="btn btn-primary" on:click={getOrder}>Details</button>
      </div>
    </div>

    <h2 class="mt-5">Order Details</h2>
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">
          Order
          {#if loadingOrders}
            <Spinner />
          {/if}
        </h5>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            <strong>Quantity:</strong>
            {orderDetails.quantity}
          </li>
          <li class="list-group-item">
            <strong>Amount:</strong>
            {orderDetails.amount}
          </li>
          <li class="list-group-item">
            <strong>Buyer Address:</strong>
            {orderDetails.buyerAddr}
          </li>
          <li class="list-group-item">
            <strong>Shipping Address:(encrypted)</strong>
            {orderDetails.shippingAddr}
          </li>
          <li class="list-group-item">
            <strong>Shipping Address:(decrypted)</strong>
            {decryptAddr}
          </li>
          <li class="list-group-item">
            <strong>Order Status:</strong>
            {orderStatus(Number(orderDetails.status))}
          </li>
        </ul>
      </div>
    </div>

    <div class="d-flex justify-content-between mt-4">
      <button class="btn btn-primary" on:click={processOrder}
        >process order</button
      >
      <div>
        <button class="btn btn-primary" on:click={cancelOrder}>cancel</button>
      </div>
    </div>
  </section>
  
  <section>
    <div class="settings mt-5">
      <!-- Card Layout for Settings -->
      <div class="card shadow-sm mb-4">
        <div class="card-body">
          <h5 class="card-title mb-4 fw-semibold">Settings</h5>
          <!-- Set Stock -->
          <div class="row g-3 align-items-end mb-4">
            <div class="col-md-6">
              <label for="stock" class="form-label">Set Stock</label>
              <input
                type="number"
                id="stock"
                name="stock"
                class="form-control"
                bind:value={newTotalStock}
                placeholder="Enter total stock"
              />
            </div>
            <div class="col-md-6 d-flex">
              <button class="btn btn-primary w-50" on:click={handleSetStock}>
                Set Stock
              </button>
            </div>
          </div>
          <!-- Set Price -->
          <div class="row g-3 align-items-end mb-4">
            <div class="col-md-6">
              <label for="price" class="form-label">Set Price</label>
              <input
                type="number"
                id="price"
                name="price"
                class="form-control"
                bind:value={newPrice}
                placeholder="Enter price"
              />
            </div>
            <div class="col-md-6 d-flex">
              <button class="btn btn-primary w-50" on:click={handleSetPrice}>
                Set Price
              </button>
            </div>
          </div>

          <!-- Set Shipping Cost -->
          <div class="row g-3 align-items-end mb-4">
            <div class="col-md-6">
              <label for="shippingCost" class="form-label"
                >Set Shipping Cost</label
              >
              <input
                type="number"
                id="shippingCost"
                name="shippingCost"
                class="form-control"
                bind:value={newShippingCost}
                placeholder="Enter shipping cost"
                />
              </div>
            <div class="col-md-6 d-flex">
              <button
              class="btn btn-primary w-50"
                on:click={handleSetShippingCost}
                >
                Set Shipping
              </button>
            </div>
          </div>

          <!-- Set Public Key -->
          <div class="row g-3 align-items-end mb-4">
            <div class="col-md-6">
              <label for="publicKey" class="form-label">Set Public Key</label>
              <input
                type="text"
                id="publicKey"
                name="publicKey"
                class="form-control"
                bind:value={publicKey}
                placeholder="Enter public key"
              />
            </div>
            <div class="col-md-6 d-flex">
              <button
                class="btn btn-primary w-50"
                on:click={handleSetPublicKey}
              >
                Set Public Key
              </button>
            </div>
          </div>

          <!-- Set Owner -->
          <div class="row g-3 align-items-end mb-4">
            <div class="col-md-6">
              <label for="publicKey" class="form-label">Set Owner</label>
              <input
                type="text"
                id="publicKey"
                name="publicKey"
                class="form-control"
                bind:value={newOwner}
                placeholder="Enter owner addr"
              />
            </div>
            
            <div class="col-md-6 d-flex">
              <button
                class="btn btn-primary w-50"
                on:click={handleSetOwner}
              >
                Set Owner
              </button>
            </div>
          </div>

             <!-- Set Admin -->
             <div class="row g-3 align-items-end mb-4">
              <div class="col-md-6">
                <label for="publicKey" class="form-label">Set Admin</label>
                <input
                  type="text"
                  id="publicKey"
                  name="publicKey"
                  class="form-control"
                  bind:value={newAdmin}
                  placeholder="Enter admin address"
                />
              </div>
              
              <div class="col-md-6 d-flex">
                <button
                  class="btn btn-primary w-50"
                  on:click={handleSetAdmin}
                >
                  Set Admin
                </button>
              </div>
            </div>

               <!-- Remove Admin -->
               <div class="row g-3 align-items-end">
                <div class="col-md-6">
                  <label for="publicKey" class="form-label">Remove Admin</label>
                  <input
                    type="text"
                    id="publicKey"
                    name="publicKey"
                    class="form-control"
                    bind:value={oldAdmin}
                    placeholder="Enter admin address"
                  />
                </div>
                
                <div class="col-md-6 d-flex">
                  <button
                    class="btn btn-primary w-50"
                    on:click={handleRemoveAdmin}
                  >
                    Set Admin
                  </button>
                </div>
              </div>  

        </div>
      </div>
    </div>
</section>

<section>
  <!-- Card Layout for Actions -->
  <div class="card shadow-sm">
    <div class="card-body">
      <h5 class="card-title mb-4 fw-semibold">Actions</h5>
      <div class="d-grid gap-3">

        <button
        class="btn btn-outline-primary btn-lg"
          on:click={getTotalWithdraw}
        >
        Total Withdraw
        </button>

        {#if totalWithdraw}
          <p>Total Withdraw: {totalWithdraw}</p>
        {/if}

        <button
          class="btn btn-outline-primary btn-lg"
          on:click={getAmountAfterShipping}
        >
          Amount After Shipping
        </button>

        {#if amountAfterShipping}
          <p>Amount after shipping: {amountAfterShipping}</p>
        {/if}

        <button
          class="btn btn-outline-primary btn-lg"
          on:click={getTotalPayment}
        >
          Total Payment
        </button>

        {#if totalPayment}
          <p>Total payment: {totalPayment}</p>
        {/if}

        <button class="btn btn-outline-primary btn-lg" on:click={withdraw}>
          Withdraw
        </button>

        <button class="btn btn-outline-primary btn-lg" on:click={getOwner}>
          Get Owner
        </button>

        {#if currentOwner}
          <p>Owner: {currentOwner}</p>
        {/if}

        <button class="btn btn-outline-primary btn-lg" on:click={getTotalStock}>
          Total Stock
        </button>

        {#if totalStock}
          <p>Total Stock: {totalStock}</p>
        {/if}

        <button class="btn btn-outline-primary btn-lg" on:click={getTotalOrder}>
          Total Order
        </button>

        {#if totalOrder}
          <p>Total Order: {totalOrder}</p>
        {/if}
        
      </div>
    </div>
  </div>
</section>
</div>

<style>
  .card {
    border: none;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  .list-group-item {
    border: none;
  }
  .btn {
    height: 38px;
  }
  .form-control {
    margin-bottom: 0;
  }
  .btn {
    height: 38px; /* Ensure buttons have a consistent height */
  }
  .form-control {
    margin-bottom: 0; /* Remove default margin to align with button */
  }
</style>

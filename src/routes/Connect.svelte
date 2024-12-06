<script>
  import onboard from "$lib/onboard.js";
  import { provider, networkError } from "$lib/stores.js";

  let copied = false;

  const networks = {
    arbitrum: { name: "Arbitrum", chainId: "0xa4b1" },
    sepolia: { name: "Sepolia", chainId: "0xaa36a7" },
    sepoliaArbitrum: { name: "Sepolia Arbitrum", chainId: "0x66eee" },
    wrongNetwork: { name: "Wrong Network", chainId: "0x00" }, // Placeholder for unsupported networks
  };

  let selectedNetwork = null;
  let isWrongNetwork = false; 

  // Subscribe to wallet updates
  const wallets$ = onboard.state.select("wallets");
  $: connectedAccount = $wallets$?.[0]?.accounts?.[0];

  $: account = connectedAccount?.ens?.name
    ? { ens: connectedAccount?.ens, address: connectedAccount?.address }
    : { address: connectedAccount?.address };

  $: provider.set($wallets$?.[0]?.provider);

  // Detect network and update dropdown selection
  const getChainId = async () => {
    if (!$provider) return;

    try {
      const chainId = await $provider.request({ method: "eth_chainId" });
      const foundNetwork = Object.values(networks).find(net => net.chainId === chainId);

      if (foundNetwork) {
        selectedNetwork = foundNetwork.chainId;
        networkError.set("");
      } else {
        selectedNetwork = networks.wrongNetwork.chainId; 
        networkError.set("Wrong Network: Please switch to Arbitrum network or Sepolia testnet");
      }
      console.log("Selected Network:", selectedNetwork);
    } catch (error) {
      console.error("Error fetching chainId:", error);
    }
  };

  $: if ($provider) getChainId(); 

  const requestNetworkSwitch = async (chainId) => {
    if (!$provider) return;
    try {
      console.log('Switching network to:', chainId);
      await $provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }],
      });
      selectedNetwork = chainId;
      isWrongNetwork = false; 
    } catch (error) {
      console.log('Network switch error', error);
    }
  };

  const connect = async () => {
    try {
      await onboard.connectWallet();
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const disconnect = ({ label }) => {
    networkError.set("");
    onboard.disconnectWallet({ label });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(account.address);
      copied = true;
      setTimeout(() => (copied = false), 2000);
    } catch (err) {
      console.error("Failed to copy address: ", err);
    }
  };
</script>
{#if $provider}
  <div class="container">
    <div class="row g-2 align-items-center">
      <!-- Network Selection (Dropdown) -->
      <div class="col-md-auto">
        <select bind:value={selectedNetwork} on:change={() => requestNetworkSwitch(selectedNetwork)} class="form-select">
          {#each Object.entries(networks) as [key, network]}
            {#if network.chainId !== networks.wrongNetwork.chainId}
              <option value={network.chainId}>{network.name}</option>
            {/if}
          {/each}
          {#if selectedNetwork === networks.wrongNetwork.chainId}
            <option value={networks.wrongNetwork.chainId}>❌ Wrong Network</option>
          {/if}
        </select>
      </div>

      <!-- Wallet Address & Copy Button -->
      <div class="col-md-auto d-flex align-items-center">
        <button type="button" class="btn btn-light border border-success d-flex align-items-center gap-2" on:click={copyToClipboard}>
          <span>{account.address.slice(0, 6)}...{account.address.slice(-4)}</span>
          {#if copied}
            <i class="bi bi-check2"></i>
          {:else}
            <i class="bi bi-clipboard"></i>
          {/if}
        </button>
      </div>

      <!-- Disconnect Button -->
      <div class="col-md-auto">
        <button type="button" class="btn btn-danger" aria-label="Disconnect Wallet" on:click={disconnect($wallets$?.[0])}>
          <i class="bi bi-power"></i>
        </button>
      </div>
    </div>
  </div>
{:else}
  <div class="d-flex justify-content-center">
    <button type="button" class="btn btn-success" on:click={connect}>Connect Wallet</button>
  </div>
{/if}

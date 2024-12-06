<script>
    let { children } = $props();
    import Connect from "./Connect.svelte";
    import "bootstrap/dist/css/bootstrap.min.css";
    import "bootstrap-icons/font/bootstrap-icons.css";
    import { onMount } from "svelte";
    import { networkError } from "$lib/stores.js";

    onMount(async () => {
        // Dynamically import Bootstrap JS
        await import("bootstrap/dist/js/bootstrap.bundle.min.js");
    });
</script>

{#if $networkError}
    <div class="alert alert-danger text-center" role="alert">
        {$networkError}
    </div>
{/if}

<nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
    <div class="container">
        <a class="navbar-brand fw-bold fs-4 text-dark" href="/">apsoshop</a>
        <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
        >
            <span class="navbar-toggler-icon"></span>
        </button>

        <div
            class="collapse navbar-collapse justify-content-between"
            id="navbarSupportedContent"
        >
            <div class="d-flex align-items-center ms-auto">
                <Connect />
            </div>
        </div>
    </div>
</nav>

{@render children()}

<div class="container mt-5" style="max-width: 800px;">
    <footer
        class="text-center d-flex flex-column align-items-center py-4 border-top"
    >
        <div class="d-flex gap-4 mb-3">
            <a
                href="https://discord.gg/fFqxS8te"
                target="_blank"
                class="text-dark"
                aria-label="Discord"
            >
                <i class="bi bi-discord fs-3"></i>
            </a>

            <a
                href="https://github.com/dappresearch"
                target="_blank"
                class="text-dark"
                aria-label="Github"
            >
                <i class="bi bi-github fs-3"></i>
            </a>
            <a
                href="https://twitter.com/dapp_research"
                target="_blank"
                class="text-dark"
                aria-label="Twitter"
            >
                <i class="bi bi-twitter fs-3"></i>
            </a>
        </div>
        <p class="mb-0 text-muted">dappresearch@proton.me</p>
    </footer>
</div>

<style>
    .alert {
        max-width: 800px;
        margin: 0 auto;
    }

    .navbar {
        padding: 1rem 0;
    }

    .navbar-brand {
        font-size: 1.5rem;
        letter-spacing: 1px;
    }

    /* Nav Link Hover Effect */
    .nav-link.hover-effect {
        position: relative;
        color: rgba(0, 0, 0, 0.7) !important;
        transition: color 0.3s ease;
    }

    .nav-link.hover-effect::after {
        content: "";
        position: absolute;
        width: 0;
        height: 2px;
        background: #000;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        transition: width 0.3s ease;
    }

    .nav-link.hover-effect:hover {
        color: #000 !important;
    }

    .nav-link.hover-effect:hover::after {
        width: 100%;
    }

    /* Toggle Button Styling */
    .navbar-toggler {
        border: none;
        outline: none;
    }

    .navbar-toggler:focus {
        box-shadow: none;
    }

    .navbar-toggler-icon {
        background-image: none;
        position: relative;
        width: 24px;
        height: 2px;
        background: #000;
        transition: all 0.3s ease;
    }

    .navbar-toggler-icon::before,
    .navbar-toggler-icon::after {
        content: "";
        position: absolute;
        width: 24px;
        height: 2px;
        background: #000;
        transition: all 0.3s ease;
    }

    .navbar-toggler-icon::before {
        transform: translateY(-6px);
    }

    .navbar-toggler-icon::after {
        transform: translateY(6px);
    }

    .navbar {
        padding: 0.3rem 0; /* Reduce vertical padding */
        min-height: 10px; /* Adjust minimum height */
    }
</style>

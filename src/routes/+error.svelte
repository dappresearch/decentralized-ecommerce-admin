<script>
    import sticker from "$lib/assets/cute404.jpg";
</script>

<div class="d-flex justify-content-center align-items-center vh-100">
    <div class="text-center">
        
        <img src={sticker} class="img-fluid sticker-image mb-4" alt="404 Error">
        <h1 class="display-4">wofPage wofNot wofFound</h1>
        <p class="lead">Sorry, the page you are looking for does not exist.</p>
        <a href="/" class="btn btn-primary">Go to Homepage</a>
    </div>
</div>

<style>
    .sticker-image {
        max-width: 25%;
    }
</style>
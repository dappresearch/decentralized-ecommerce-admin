<script>
    export let showModal = false;

    export function openModal() {
        showModal = true;
    }

    export function closeModal() {
        showModal = false;
    }
</script>

<div
    class="modal"
    tabindex="-1"
    role="dialog"
    style="display: {showModal
        ? 'block'
        : 'none'}; background-color: rgba(0, 0, 0, 0.5);"
>
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header d-flex justify-content-center">
                <p class="modal-title">Waiting for signature.</p>
            </div>
            <div class="modal-body">
                <div class="d-flex justify-content-center">
                    <div class="spinner-border" role="status">
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button
                    type="button"
                    class="btn btn-secondary"
                    on:click={closeModal}>Close</button
                >
            </div>
        </div>
    </div>
</div>

<style>
    /* Remove the border at the bottom of the modal header */
    .modal-header {
        border-bottom: none;
    }

    /* Remove the border at the top of the modal footer */
    .modal-footer {
        border-top: none;
    }
</style>
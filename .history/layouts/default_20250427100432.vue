<template>
    <div>

        <ClientOnly>
            <div :class="locale == 'ar' ? 'bodyAR' : 'bodyEN'">
                <!-- <SharedNavbar class="" /> -->
                <slot />

                <!-- <SharedFooter /> -->
            </div>
        </ClientOnly>
    </div>
</template>

<script setup>

const { locale } = useI18n();



</script>
<style lang="scss" scoped></style>
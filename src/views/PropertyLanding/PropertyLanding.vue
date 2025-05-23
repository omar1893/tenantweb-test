<template>
  <ion-page class="bg-black justify-normal pb-[20px] overflow-y-auto">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-white">Loading...</div>
    </div>

    <!-- Content -->
    <template v-else>
      <!-- Property Header Section -->
      <div class="relative">
        <img
          src="@/assets/property-image.png"
          alt="505 Deerfield COA"
          class="w-full h-[300px] object-cover"
        >

        <!-- Property Info Overlay -->
        <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-left">
          <div class="flex items-center gap-2 mb-2">
            <TGoogleMaps
              label="See on Google maps"
              :address="fullAddress"
            />
          </div>
        </div>
      </div>

      <div class="p-4 text-left">
        <h1 class="text-large text-white mb-2">{{ property.name }}</h1>
        <p class="body-medium text-white/90 mb-4">{{ fullAddress }}</p>

        <div class="flex items-center gap-2">
          <TLabel
            label="Property Code"
            :copy-value="property.code"
          />
        </div>
      </div>

      <!-- Property Requirements Section -->
      <div class="p-4">
        <h2 class="button-large mb-4 text-white">Property Requirements</h2>
        <TAccordion
          :items="propertyRequirements"
          multiple
        />
      </div>
      <div class="button-bar w-full p-4 z-10">
        <TButton
          class="w-full !rounded-[100px] button-large"
          variant="white"
          label="Apply Now"
          icon="pi pi-apple"
          @click="applyNow"
        />
      </div>

      <div v-if="googlePlaceInfo" class="mt-6 p-4 rounded-lg bg-white/10 border border-white/10">
        <h3 class="text-white mb-2">Google Place Info</h3>
        <div class="text-white/80">
          <div><b>Name:</b> {{ googlePlaceInfo.name }}</div>
          <div><b>Address:</b> {{ googlePlaceInfo.formatted_address }}</div>
          <div v-if="googlePlaceInfo.formatted_phone_number"><b>Phone:</b> {{ googlePlaceInfo.formatted_phone_number }}</div>
          <div v-if="googlePlaceInfo.website"><b>Website:</b> <a :href="googlePlaceInfo.website" target="_blank" class="underline text-blue-400">{{ googlePlaceInfo.website }}</a></div>
        </div>
      </div>
    </template>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TAccordion from '@/components/TAccordion.vue'
import TLabel from '@/components/TLabel.vue'
import TGoogleMaps from '@/components/TGoogleMaps.vue'
import TButton from '@/components/TButton.vue'
import { propertyService } from '@/services/property.service'
import axios from 'axios'
import { IonPage } from '@ionic/vue'

interface Property {
  id: string
  code: string
  name: string
  address: {
    street: string
    city: string
    state: string
    zip_code: string
  }
  configuration: {
    type: string
    requirements: string[]
  }[]
}

const route = useRoute()
const router = useRouter()
const propertyId = computed(() => route.params.propertyId as string)
const loading = ref(true)
const property = ref<Property>({} as Property)

const fullAddress = computed(() => {
  if (!property.value.address) return ''
  const { street, city, state, zip_code } = property.value.address
  return `${street}, ${city}, ${state} ${zip_code}`
})

const propertyRequirements = computed(() => {
  if (!property.value.configuration) return []
  return property.value.configuration.map(config => ({
    header: config.type.charAt(0) + config.type.slice(1).toLowerCase(),
    content: config.requirements
  }))
})

const GOOGLE_API_KEY = 'AIzaSyAHFOQEwRQ6_CGQcBZ7R7fLO0ECSqrNxWw'
const googlePlaceInfo = ref<any>(null)

const fetchGooglePlaceInfo = async (address: string) => {
  try {
    const searchUrl = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json'
    const searchResp = await axios.get(searchUrl, {
      params: {
        input: address,
        inputtype: 'textquery',
        key: GOOGLE_API_KEY,
        fields: 'place_id'
      }
    })
    const placeId = searchResp.data.candidates?.[0]?.place_id
    if (!placeId) return null

    const detailsUrl = 'https://maps.googleapis.com/maps/api/place/details/json'
    const detailsResp = await axios.get(detailsUrl, {
      params: {
        place_id: placeId,
        key: GOOGLE_API_KEY,
        fields: 'name,formatted_address,geometry,photos,types,website,formatted_phone_number'
      }
    })
    console.log('Google Places API result:', detailsResp.data)
    return detailsResp.data.result
  } catch (e) {
    console.error('Error fetching Google Place info:', e)
    return null
  }
}

const fetchPropertyData = async () => {
  try {
    property.value = await propertyService.getPropertyLandingPage(propertyId.value)
    console.log('property', property.value)
    const address = fullAddress.value
    googlePlaceInfo.value = await fetchGooglePlaceInfo(address)
  } catch (error) {
    console.error('Error fetching property data:', error)
  } finally {
    loading.value = false
  }
}

const applyNow = () => {
  router.push({ name: 'VideoIntro' })
}

onMounted(() => {
  fetchPropertyData()
})
</script>

<style scoped lang="scss">
.property-landing {
  @apply min-h-screen bg-gray-100;
}

.button-bar {
  margin-top: auto;
  background: linear-gradient(to top, rgba(0,0,0,0.85) 80%, transparent 100%);
}
</style>

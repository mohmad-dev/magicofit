import {
  createWorkflow,
  WorkflowResponse,
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"

/**
 * Reserve Inventory Workflow
 * 
 * This workflow atomically reserves inventory for items in a cart.
 * It ensures that inventory is reserved only if sufficient stock is available,
 * preventing overselling in concurrent order scenarios.
 * 
 * Steps:
 * 1. Validate inventory availability for all items
 * 2. Reserve inventory atomically
 * 3. Return reservation IDs for tracking
 */

type ReserveInventoryInput = {
  items: Array<{
    variant_id: string
    quantity: number
    location_id: string
  }>
}

type ReserveInventoryOutput = {
  reservations: Array<{
    variant_id: string
    quantity: number
    reservation_id: string
  }>
}

const validateInventoryStep = createStep(
  "validate-inventory",
  async (input: ReserveInventoryInput, { container }) => {
    const inventoryService: any = container.resolve("inventoryService")
    
    for (const item of input.items) {
      const availability = await inventoryService.retrieveAvailableQuantity(
        item.variant_id,
        [item.location_id]
      )
      
      if (availability < item.quantity) {
        throw new Error(
          `Insufficient inventory for variant ${item.variant_id}. ` +
          `Requested: ${item.quantity}, Available: ${availability}`
        )
      }
    }
    
    return new StepResponse(input)
  }
)

const reserveInventoryStep = createStep(
  "reserve-inventory",
  async (input: ReserveInventoryInput, { container }) => {
    const inventoryService: any = container.resolve("inventoryService")
    const reservations: ReserveInventoryOutput["reservations"] = []
    
    for (const item of input.items) {
      const reservation = await inventoryService.createReservationItem(
        item.variant_id,
        item.location_id,
        item.quantity
      )
      
      reservations.push({
        variant_id: item.variant_id,
        quantity: item.quantity,
        reservation_id: reservation.id,
      })
    }
    
    return new StepResponse(reservations, reservations)
  },
  async (reservations, { container }) => {
    // Compensate: Release reservations if workflow fails
    if (!reservations) return
    
    const inventoryService: any = container.resolve("inventoryService")
    
    for (const reservation of reservations) {
      await inventoryService.deleteReservationItem(reservation.reservation_id)
    }
  }
)

export const reserveInventoryWorkflow = createWorkflow(
  "reserve-inventory",
  function (input: ReserveInventoryInput) {
    const validated = validateInventoryStep(input)
    const reservations = reserveInventoryStep(validated)
    
    return new WorkflowResponse(reservations)
  }
)

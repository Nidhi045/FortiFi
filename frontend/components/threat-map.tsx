"use client"

import { useEffect, useRef, useState } from "react"

// Sample threat data for India
const indiaThreats = [
  { lat: 28.6139, lng: 77.209, intensity: 0.8, city: "Delhi", state: "Delhi" },
  { lat: 19.076, lng: 72.8777, intensity: 0.9, city: "Mumbai", state: "Maharashtra" },
  { lat: 12.9716, lng: 77.5946, intensity: 0.7, city: "Bangalore", state: "Karnataka" },
  { lat: 17.385, lng: 78.4867, intensity: 0.5, city: "Hyderabad", state: "Telangana" },
  { lat: 22.5726, lng: 88.3639, intensity: 0.6, city: "Kolkata", state: "West Bengal" },
  { lat: 13.0827, lng: 80.2707, intensity: 0.4, city: "Chennai", state: "Tamil Nadu" },
  { lat: 23.0225, lng: 72.5714, intensity: 0.3, city: "Ahmedabad", state: "Gujarat" },
  { lat: 26.9124, lng: 75.7873, intensity: 0.5, city: "Jaipur", state: "Rajasthan" },
  { lat: 25.5941, lng: 85.1376, intensity: 0.7, city: "Patna", state: "Bihar" },
  { lat: 30.7333, lng: 76.7794, intensity: 0.4, city: "Chandigarh", state: "Punjab" },
]

export function ThreatMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [activeThreats, setActiveThreats] = useState<string[]>([])
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [focusRegion, setFocusRegion] = useState("india") // "india" or "global"

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current
        const container = canvas.parentElement
        if (container) {
          const { width, height } = container.getBoundingClientRect()
          setDimensions({ width, height })
          canvas.width = width
          canvas.height = height
        }
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background
    ctx.fillStyle = "#1e293b"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid lines
    ctx.strokeStyle = "#334155"
    ctx.lineWidth = 0.5

    // Horizontal grid lines
    for (let i = 0; i < canvas.height; i += 30) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width, i)
      ctx.stroke()
    }

    // Vertical grid lines
    for (let i = 0; i < canvas.width; i += 30) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }

    // Draw India outline (simplified)
    if (focusRegion === "india") {
      ctx.beginPath()
      ctx.strokeStyle = "#64748b"
      ctx.lineWidth = 1.5

      // Very simplified India outline - just for visual effect
      const indiaOutline = [
        { lat: 35.5, lng: 76.5 }, // Northern point
        { lat: 32.5, lng: 79.8 }, // Northeast
        { lat: 27.5, lng: 88.5 }, // East
        { lat: 22.0, lng: 88.0 }, // Southeast
        { lat: 8.5, lng: 78.0 }, // South
        { lat: 8.0, lng: 77.0 }, // Southwest
        { lat: 20.0, lng: 70.0 }, // West
        { lat: 23.0, lng: 68.0 }, // Northwest
        { lat: 35.5, lng: 76.5 }, // Back to start
      ]

      // Convert lat/lng to canvas coordinates
      const points = indiaOutline.map((point) => {
        // For India-focused map, we adjust the coordinates
        const x = ((point.lng - 68) / (97 - 68)) * canvas.width
        const y = ((35.5 - point.lat) / (35.5 - 8)) * canvas.height
        return { x, y }
      })

      // Draw the outline
      ctx.moveTo(points[0].x, points[0].y)
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y)
      }
      ctx.stroke()

      // Draw state boundaries (simplified)
      ctx.strokeStyle = "#475569"
      ctx.lineWidth = 0.8

      // Just a few major state boundaries for visual effect
      const stateBoundaries = [
        [
          { lat: 28.0, lng: 77.0 },
          { lat: 28.0, lng: 80.0 },
        ], // Delhi/UP
        [
          { lat: 19.0, lng: 72.0 },
          { lat: 19.0, lng: 78.0 },
        ], // Maharashtra
        [
          { lat: 13.0, lng: 74.0 },
          { lat: 13.0, lng: 80.0 },
        ], // Karnataka/TN
      ]

      stateBoundaries.forEach((boundary) => {
        const points = boundary.map((point) => {
          const x = ((point.lng - 68) / (97 - 68)) * canvas.width
          const y = ((35.5 - point.lat) / (35.5 - 8)) * canvas.height
          return { x, y }
        })

        ctx.beginPath()
        ctx.moveTo(points[0].x, points[0].y)
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y)
        }
        ctx.stroke()
      })

      // Draw threat points for India
      indiaThreats.forEach((threat) => {
        // Convert lat/lng to x/y coordinates for India-focused map
        const x = ((threat.lng - 68) / (97 - 68)) * canvas.width
        const y = ((35.5 - threat.lat) / (35.5 - 8)) * canvas.height

        // Draw threat point
        const radius = 5 + threat.intensity * 15
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
        gradient.addColorStop(0, `rgba(239, 68, 68, ${threat.intensity})`)
        gradient.addColorStop(1, "rgba(239, 68, 68, 0)")

        ctx.beginPath()
        ctx.fillStyle = gradient
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fill()

        // Draw city name
        if (threat.intensity > 0.5) {
          ctx.fillStyle = "#f8fafc"
          ctx.font = "10px sans-serif"
          ctx.textAlign = "center"
          ctx.fillText(threat.city, x, y - radius - 5)
        }

        // Draw pulse animation for some threats
        if (activeThreats.includes(threat.city)) {
          ctx.beginPath()
          ctx.strokeStyle = "rgba(239, 68, 68, 0.5)"
          ctx.lineWidth = 1
          ctx.arc(x, y, radius + 5, 0, Math.PI * 2)
          ctx.stroke()
        }
      })
    } else {
      // Global view - similar to original implementation
      // Draw threat points
      indiaThreats.forEach((threat) => {
        // Convert lat/lng to x/y coordinates (simplified)
        const x = ((threat.lng + 180) / 360) * canvas.width
        const y = ((90 - threat.lat) / 180) * canvas.height

        // Draw threat point
        const radius = 5 + threat.intensity * 15
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
        gradient.addColorStop(0, `rgba(239, 68, 68, ${threat.intensity})`)
        gradient.addColorStop(1, "rgba(239, 68, 68, 0)")

        ctx.beginPath()
        ctx.fillStyle = gradient
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fill()

        // Draw pulse animation for some threats
        if (activeThreats.includes(threat.city)) {
          ctx.beginPath()
          ctx.strokeStyle = "rgba(239, 68, 68, 0.5)"
          ctx.lineWidth = 1
          ctx.arc(x, y, radius + 5, 0, Math.PI * 2)
          ctx.stroke()
        }
      })
    }
  }, [dimensions, activeThreats, focusRegion])

  // Simulate active threats changing
  useEffect(() => {
    const interval = setInterval(() => {
      const randomThreat = indiaThreats[Math.floor(Math.random() * indiaThreats.length)]
      setActiveThreats((prev) => {
        // Add the new threat if it's not already active
        if (!prev.includes(randomThreat.city)) {
          return [...prev, randomThreat.city]
        }
        // Otherwise, remove a random threat
        const index = Math.floor(Math.random() * prev.length)
        return prev.filter((_, i) => i !== index)
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div suppressHydrationWarning className="relative w-full h-full">
      <div className="absolute top-2 right-2 z-10">
        <button
          className="px-2 py-1 text-xs bg-muted rounded-md"
          onClick={() => setFocusRegion(focusRegion === "india" ? "global" : "india")}
        >
          {focusRegion === "india" ? "Global View" : "India View"}
        </button>
      </div>
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute bottom-2 left-2 bg-background/80 p-2 rounded-md text-xs">
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></span>
          <span>Fraud Hotspots</span>
        </div>
        <div className="mt-1">
          {activeThreats.length > 0 ? (
            <span>{activeThreats.join(", ")}</span>
          ) : (
            <span className="text-muted-foreground">No active threats</span>
          )}
        </div>
      </div>
    </div>
  )
}


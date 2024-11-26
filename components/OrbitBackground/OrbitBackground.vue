<template>
  <div class="orbit-container">
    <canvas ref="canvas" class="orbit-background"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'

export default {
  name: 'OrbitBackground',
  setup() {
    const canvas = ref(null)
    let ctx = null
    let solarSystems = []
    let animationFrameId = null
    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2

    class Planet {
      constructor(star, orbitRadius, color) {
        this.star = star
        this.orbitRadius = orbitRadius
        this.size = Math.random() * 0.03 + 0.02
        this.mass = (Math.random() * 0.001 + 0.0002) * star.mass 
        this.color = color
        this.orbitAngle = Math.random() * Math.PI * 2
        this.eccentricity = Math.random() * 0.2  
        this.semiMajorAxis = orbitRadius
        this.semiMinorAxis = orbitRadius * Math.sqrt(1 - this.eccentricity * this.eccentricity)
        this.orbitSpeed = Math.sqrt(star.mass / Math.pow(this.semiMajorAxis, 3)) * 0.01
        
        this.x = this.star.x + Math.cos(this.orbitAngle) * this.orbitRadius
        this.y = this.star.y + Math.sin(this.orbitAngle) * this.orbitRadius
        
        const orbitSpeed = Math.sqrt(this.star.mass / this.orbitRadius) * 0.02
        this.velocity = {
          x: -Math.sin(this.orbitAngle) * orbitSpeed,  
          y: Math.cos(this.orbitAngle) * orbitSpeed
        }
        
        this.active = true
      }

      checkCollision(other) {
        const dx = this.x - other.x
        const dy = this.y - other.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const minDist = this.size + other.size
        return dist < minDist
      }

      merge(other) {
        // 计算合并后的质量和动量
        const totalMass = this.mass + other.mass
        const newVelX = (this.velocity.x * this.mass + other.velocity.x * other.mass) / totalMass
        const newVelY = (this.velocity.y * this.mass + other.velocity.y * other.mass) / totalMass
        
        // 更新质量和速度
        this.mass = totalMass
        this.velocity.x = newVelX
        this.velocity.y = newVelY
        this.size = Math.sqrt(totalMass * 100) * 0.5
      }

      update() {
        const dxStar = this.x - this.star.x
        const dyStar = this.y - this.star.y
        const distToStar = Math.sqrt(dxStar * dxStar + dyStar * dyStar)
        
        // 检查是否撞击恒星
        if (distToStar < this.star.radius + this.size) {
          this.active = false
          return
        }

        const starForce = this.star.mass / (distToStar * distToStar)
        const starAngle = Math.atan2(dyStar, dxStar)
        
        // 计算鼠标引力
        const mouseMass = this.star.mass * 20.67
        const dx = this.x - mouseX
        const dy = this.y - mouseY
        const distToMouse = Math.sqrt(dx * dx + dy * dy)
        // 增加最小距离以避免过强引力
        const minDist = 50
        const mouseForce = mouseMass / (Math.max(distToMouse, minDist) * Math.max(distToMouse, minDist))
        const mouseAngle = Math.atan2(dy, dx)

        // 应用恒星引力
        this.velocity.x -= Math.cos(starAngle) * starForce * 0.015
        this.velocity.y -= Math.sin(starAngle) * starForce * 0.015
        
        // 应用鼠标引力
        this.velocity.x -= Math.cos(mouseAngle) * mouseForce * 0.01
        this.velocity.y -= Math.sin(mouseAngle) * mouseForce * 0.01
        
        this.orbitAngle += this.orbitSpeed

        const friction = 0.9999
        this.velocity.x = this.velocity.x * friction
        this.velocity.y = this.velocity.y * friction

        this.x += this.velocity.x
        this.y += this.velocity.y

        ctx.beginPath()
        const displayRadius = this.size * Math.sqrt(this.mass * 100)
        ctx.arc(this.x, this.y, displayRadius, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()

        const glow = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, displayRadius * 3
        )
        glow.addColorStop(0, this.color.replace(/[\d.]+\)$/, '0.2)'))
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = glow
        ctx.fill()
      }
    }

    class SolarSystem {
      constructor(x, y, orbitRadius = 0, orbitAngle = 0) {
        this.x = x
        this.y = y
        this.orbitRadius = orbitRadius
        this.orbitAngle = orbitAngle
        this.orbitSpeed = Math.sqrt(100 / orbitRadius) * 0.004
        this.radius = Math.random() * 8 + 12
        // 增大恒星质量1000倍以上
        this.mass = Math.random() * 2000 + 400000
        this.active = true
        
        const starColors = [
          [255, 200, 150],
          [200, 220, 255],
          [255, 255, 200],
          [255, 180, 180]
        ]
        const [r, g, b] = starColors[Math.floor(Math.random() * starColors.length)]
        this.color = `rgba(${r}, ${g}, ${b}, 0.9)`
        
        this.planets = []
        
        const addInitialPlanets = (star) => {
          const planetCount = Math.floor(Math.random() * 3) + 10
          for (let i = 0; i < planetCount; i++) {
            const distance = (i + 1) * 50 + Math.random() * 5
            const colors = [
              [150, 255, 150],
              [150, 150, 255],
              [255, 150, 255],
              [255, 200, 150],
              [200, 255, 255],
              [255, 180, 180],
              [180, 255, 220],
              [220, 180, 255]
            ]
            const color = colors[i % colors.length]
            const planet = new Planet(star, distance,
              `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.8)`)
            
            star.planets.push(planet)
          }
        }
        
        addInitialPlanets(this)
      }

      update() {
        if (this.orbitRadius > 0) {
          const centerX = canvas.value.width / 2
          const centerY = canvas.value.height / 2
          
          this.orbitAngle += this.orbitSpeed
          
          this.x = centerX + Math.cos(this.orbitAngle) * this.orbitRadius
          this.y = centerY + Math.sin(this.orbitAngle) * this.orbitRadius
        }

        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()

        const glow = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.radius * 5
        )
        glow.addColorStop(0, this.color.replace(/[\d.]+\)$/, '0.4)'))
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = glow
        ctx.fill()

        this.planets = this.planets.filter(planet => planet.active)
        this.planets.forEach(planet => {
          planet.update()
        })
      }
    }

    const handleMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const resizeCanvas = () => {
      if (!canvas.value) {
        return
      }
      canvas.value.width = window.innerWidth
      canvas.value.height = window.innerHeight
    }

    const animate = () => {
      if (!canvas.value || !ctx) {
        return
      }

      ctx.fillStyle = 'rgba(0, 5, 16, 0.15)'
      ctx.fillRect(0, 0, canvas.value.width, canvas.value.height)
      
      solarSystems = solarSystems.filter(system => system.active)
      solarSystems.forEach(system => system.update())
      
      // 增加流浪行星生成概率和最大数量限制
      if (Math.random() < 0.02 && solarSystems[0].planets.length < 50) {
        const star = solarSystems[Math.floor(Math.random() * solarSystems.length)]
        const distance = Math.random() * 300 + 350
        const color = [150, 255, 150]
        const planet = new Planet(star, distance,
          `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.8)`)
        
        // 给流浪行星一个稍微偏离圆轨道的速度
        const randomFactor = 0.3  // 30%的随机偏移
        planet.velocity = {
          x: planet.velocity.x * (1 + (Math.random() - 0.5) * randomFactor),
          y: planet.velocity.y * (1 + (Math.random() - 0.5) * randomFactor)
        }
        star.planets.push(planet)
      }
      
      animationFrameId = requestAnimationFrame(animate)
    }

    onMounted(() => {
      if (canvas.value) {
        ctx = canvas.value.getContext('2d')
        resizeCanvas()
        window.addEventListener('resize', resizeCanvas)
        window.addEventListener('mousemove', handleMouseMove)
        
        const centerX = window.innerWidth / 2
        const centerY = window.innerHeight / 2
        const orbitRadius = window.innerHeight * 0.33
        
        const star1 = new SolarSystem(centerX, centerY, orbitRadius, 0)
        const star2 = new SolarSystem(centerX, centerY, orbitRadius, Math.PI)
        
        solarSystems.push(star1, star2)
        
        animate()
      }
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    })

    return {
      canvas
    }
  }
}
</script>

<style scoped>
.orbit-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.orbit-background {
  width: 100%;
  height: 100%;
}
</style>

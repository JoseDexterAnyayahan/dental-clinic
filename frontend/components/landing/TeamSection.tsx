const team = [
  {
    name:           'Dr. Maria Santos',
    specialization: 'General Dentist',
    experience:     '12 years experience',
    initial:        'MS',
  },
  {
    name:           'Dr. James Reyes',
    specialization: 'Orthodontist',
    experience:     '9 years experience',
    initial:        'JR',
  },
  {
    name:           'Dr. Ana Cruz',
    specialization: 'Oral Surgeon',
    experience:     '15 years experience',
    initial:        'AC',
  },
  {
    name:           'Dr. Carlo Mendoza',
    specialization: 'Cosmetic Dentist',
    experience:     '8 years experience',
    initial:        'CM',
  },
]

export default function TeamSection() {
  return (
    <section id="team" className="py-24 brand-gradient-light dark:bg-muted/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <span className="inline-block text-sm font-medium text-brand-blue bg-white dark:bg-blue-950/30 px-4 py-1.5 rounded-full border border-blue-200 dark:border-blue-800">
            Meet the Team
          </span>
          <h2 className="text-4xl lg:text-5xl text-brand-navy dark:text-white">
            Our Expert Dentists
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Experienced, caring professionals dedicated to your oral health and comfort.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member) => (
            <div
              key={member.name}
              className="group bg-white dark:bg-card rounded-3xl p-6 border border-blue-100 dark:border-border hover:border-brand-blue/30 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 text-center"
            >
              {/* Avatar */}
              <div className="w-20 h-20 rounded-2xl brand-gradient flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-400/30 group-hover:scale-105 transition-transform">
                <span className="text-white font-serif text-2xl font-bold">
                  {member.initial}
                </span>
              </div>

              <h3 className="font-serif text-lg text-brand-navy dark:text-white">
                {member.name}
              </h3>
              <p className="text-brand-blue text-sm font-medium mt-1">
                {member.specialization}
              </p>
              <p className="text-xs text-muted-foreground mt-2 bg-muted px-3 py-1 rounded-full inline-block">
                {member.experience}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
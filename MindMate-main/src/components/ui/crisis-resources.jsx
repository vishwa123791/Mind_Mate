import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { Button } from "./button"

export function CrisisResources() {
  const resources = [
    {
      name: "988 Suicide & Crisis Lifeline",
      description: "24/7 free and confidential support",
      action: "Call 988",
      type: "phone",
    },
    {
      name: "Crisis Text Line",
      description: "Text with a crisis counselor",
      action: "Text HELLO to 741741",
      type: "text",
    },
    {
      name: "Campus Counseling Center",
      description: "On-campus mental health services",
      action: "Visit Student Services",
      type: "local",
    },
    {
      name: "Emergency Services",
      description: "For immediate medical emergencies",
      action: "Call 911",
      type: "emergency",
    },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-center mb-4">Crisis Support Resources</h3>
      <div className="grid gap-4">
        {resources.map((resource, index) => (
          <Card key={index} className="border-l-4 border-l-destructive">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{resource.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{resource.description}</p>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-destructive hover:bg-destructive/90" size="lg">
                {resource.action}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="text-center text-sm text-muted-foreground mt-6">
        <p>
          <strong>Remember:</strong> You are not alone. These feelings will pass. Your life has value and meaning.
        </p>
      </div>
    </div>
  )
}


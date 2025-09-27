import styles from "./styles.module.scss";

type StrongholdFeaturesType = {
    activeButton : {
        category: string,
        subCategory: string
    },
    strongholdActions: {
        name: string,
        description: string
    }[],
    demesneEffects: {
        description: string
    }[],
    typeFeatures: {
        title: string,
        description: string
    }[],
    classFeatureImprovement: {
        name: string,
        description: string,
        restriction: string
    },
    strongholdType: string
}

export default function StrongholdFeatures({
    activeButton, 
    strongholdActions,
    demesneEffects,
    typeFeatures,
    classFeatureImprovement,
    strongholdType
    }:StrongholdFeaturesType){

    //pass prop activeButton from parent
    //switch statement that renders different elements-
    //category and subcategory- switches inside switch
    //return dynamic elements based on each one.

    function renderText(){
        switch(activeButton.category) {
            case "stronghold":
                switch(activeButton.subCategory){
                    case "stronghold actions":
                        return (strongholdActions.map((action) =>
                            <div className={styles.textItem}>
                                <p className={styles.itemName}>{action.name}</p>
                                <p className={styles.itemInfo}>{action.description}</p>
                            </div>
                        ))
                    case "demesne effects":
                        return (demesneEffects.map((effect) =>
                            <div className={styles.textItem}>
                                <p className={styles.itemInfo}>{effect.description}</p>
                            </div>
                        ))
                    case `${strongholdType} features`:
                        return (typeFeatures.map((feature) =>
                            <div className={styles.textItem}>
                                <p className={styles.itemName}>{feature.title}</p>
                                <p className={styles.itemInfo}>{feature.description}</p>
                            </div>
                        ))
                    case "class feature improvement":
                        return <div className={styles.textItem}>
                            <p className={styles.itemName}>{classFeatureImprovement.name}</p>
                            <p className={styles.itemInfo}>{classFeatureImprovement.description}</p>
                            <p className={styles.itemInfo}>{classFeatureImprovement.restriction}</p>
                        </div>

                }
            case "units":
                return <p>units</p>;
            case "artisans":
                return <p>artisans</p>;
            case "followers":
                return <p>followers</p>;

            default:
                return <p>nothing!</p>
        }
    }

    return <section className={styles.featuresContainer}>
        {renderText()}
    </section>
}